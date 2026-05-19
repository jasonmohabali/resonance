import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { polar } from "@/lib/polar";
import { TRPCError } from "@trpc/server";
import { chatterbox } from "@/lib/chatterbox-client";
import { generateMiMoAudio } from "@/lib/mimo-client";
import { generateElevenLabsAudio } from "@/lib/elevenlabs-client";
import { generateMiniMaxAudio } from "@/lib/minimax-client";
import { prisma } from "@/lib/db";
import { uploadAudio } from "@/lib/r2";
import { TEXT_MAX_LENGTH } from "@/features/text-to-speech/data/constants";
import { createTRPCRouter, orgProcedure } from "../init";
import type { TTSProvider, Prisma } from "@/generated/prisma/client";

export const generationsRouter = createTRPCRouter({
  getById: orgProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const generation = await prisma.generation.findUnique({
        where: { id: input.id, orgId: ctx.orgId },
        omit: {
          orgId: true,
          r2ObjectKey: true,
        },
      });

      if (!generation) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return {
        ...generation,
        audioUrl: `/api/audio/${generation.id}`,
      };
    }),

  getAll: orgProcedure.query(async ({ ctx }) => {
    const generations = await prisma.generation.findMany({
      where: { orgId: ctx.orgId },
      orderBy: { createdAt: "desc" },
      omit: {
        orgId: true,
        r2ObjectKey: true,
      },
    });

    return generations;
  }),

  create: orgProcedure
    .input(
      z.object({
        text: z.string().min(1).max(TEXT_MAX_LENGTH),
        voiceId: z.string().min(1),
        settings: z.record(z.string(), z.unknown()).optional(),
        // Legacy Chatterbox fields (backward compat)
        temperature: z.number().min(0).max(2).default(0.8).optional(),
        topP: z.number().min(0).max(1).default(0.95).optional(),
        topK: z.number().min(1).max(10000).default(1000).optional(),
        repetitionPenalty: z.number().min(1).max(2).default(1.2).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Check for active subscription before generation
      try {
        const customerState = await polar.customers.getStateExternal({
          externalId: ctx.orgId,
        });
        const hasActiveSubscription =
          (customerState.activeSubscriptions ?? []).length > 0;
        if (!hasActiveSubscription) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "SUBSCRIPTION_REQUIRED",
          });
        }
      } catch (err) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "SUBSCRIPTION_REQUIRED",
        });
      }

      const voice = await prisma.voice.findUnique({
        where: {
          id: input.voiceId,
          OR: [
            { variant: "SYSTEM" },
            { variant: "CUSTOM", orgId: ctx.orgId },
          ],
        },
        select: {
          id: true,
          name: true,
          provider: true,
          providerVoiceId: true,
          r2ObjectKey: true,
        },
      });

      if (!voice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Voice not found",
        });
      }

      // Route to the correct provider
      let audioResult: { buffer: Buffer; contentType: string };

      switch (voice.provider) {
        case "CHATTERBOX": {
          if (!voice.r2ObjectKey) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "Voice audio not available",
            });
          }

          const { data, error } = await chatterbox.POST("/generate", {
            body: {
              prompt: input.text,
              voice_key: voice.r2ObjectKey,
              temperature: input.temperature ?? 0.8,
              top_p: input.topP ?? 0.95,
              top_k: input.topK ?? 1000,
              repetition_penalty: input.repetitionPenalty ?? 1.2,
              norm_loudness: true,
            },
            parseAs: "arrayBuffer",
          });

          if (error) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to generate audio",
            });
          }

          if (!(data instanceof ArrayBuffer)) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Invalid audio response",
            });
          }

          audioResult = {
            buffer: Buffer.from(data),
            contentType: "audio/wav",
          };
          break;
        }

        case "MIMO": {
          if (!voice.providerVoiceId) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "MiMo voice ID not configured",
            });
          }

          audioResult = await generateMiMoAudio({
            text: input.text,
            voiceId: voice.providerVoiceId,
            settings: input.settings as { speed?: number } | undefined,
          });
          break;
        }

        case "ELEVENLABS": {
          if (!voice.providerVoiceId) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "ElevenLabs voice ID not configured",
            });
          }

          audioResult = await generateElevenLabsAudio({
            text: input.text,
            voiceId: voice.providerVoiceId,
            settings: input.settings as
              | {
                  stability?: number;
                  similarity_boost?: number;
                  style?: number;
                  speed?: number;
                }
              | undefined,
          });
          break;
        }

        case "MINIMAX": {
          if (!voice.providerVoiceId) {
            throw new TRPCError({
              code: "PRECONDITION_FAILED",
              message: "MiniMax voice ID not configured",
            });
          }

          audioResult = await generateMiniMaxAudio({
            text: input.text,
            voiceId: voice.providerVoiceId,
            settings: input.settings as
              | {
                  speed?: number;
                  vol?: number;
                  pitch?: number;
                  emotion?: string;
                }
              | undefined,
          });
          break;
        }

        default:
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Unsupported provider: ${voice.provider}`,
          });
      }

      Sentry.logger.info("Generation started", {
        orgId: ctx.orgId,
        voiceId: input.voiceId,
        provider: voice.provider,
        textLength: input.text.length,
      });

      let generationId: string | null = null;
      let r2ObjectKey: string | null = null;

      try {
        const generation = await prisma.generation.create({
          data: {
            orgId: ctx.orgId,
            text: input.text,
            voiceName: voice.name,
            voiceId: voice.id,
            provider: voice.provider as TTSProvider,
            contentType: audioResult.contentType,
            settings: (input.settings ?? undefined) as Prisma.InputJsonValue | undefined,
            // Legacy Chatterbox fields
            temperature: voice.provider === "CHATTERBOX" ? (input.temperature ?? 0.8) : null,
            topP: voice.provider === "CHATTERBOX" ? (input.topP ?? 0.95) : null,
            topK: voice.provider === "CHATTERBOX" ? (input.topK ?? 1000) : null,
            repetitionPenalty: voice.provider === "CHATTERBOX" ? (input.repetitionPenalty ?? 1.2) : null,
          },
          select: {
            id: true,
          },
        });

        generationId = generation.id;
        r2ObjectKey = `generations/orgs/${ctx.orgId}/${generation.id}`;

        await uploadAudio({
          buffer: audioResult.buffer,
          key: r2ObjectKey,
          contentType: audioResult.contentType,
        });

        await prisma.generation.update({
          where: { id: generation.id },
          data: { r2ObjectKey },
        });

        Sentry.logger.info("Audio generated", {
          orgId: ctx.orgId,
          generationId: generation.id,
          provider: voice.provider,
        });
      } catch {
        if (generationId) {
          await prisma.generation
            .delete({ where: { id: generationId } })
            .catch(() => {});
        }

        Sentry.logger.error("Generation failed", {
          orgId: ctx.orgId,
          voiceId: input.voiceId,
          provider: voice.provider,
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to store generated audio",
        });
      }

      if (!generationId || !r2ObjectKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to store generated audio",
        });
      }

      // Ingest usage event to Polar (fire-and-forget)
      polar.events
        .ingest({
          events: [
            {
              name: "tts_generation",
              externalCustomerId: ctx.orgId,
              metadata: {
                characters: input.text.length,
                provider: voice.provider,
              },
              timestamp: new Date(),
            },
          ],
        })
        .catch(() => {});

      return { id: generationId };
    }),
});
