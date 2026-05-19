"use client";

import { useStore } from "@tanstack/react-form";

import {
  VOICE_CATEGORY_LABELS,
} from "@/features/voices/data/voice-categories";

import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTypedAppFormContext } from "@/hooks/use-app-form";
import { VoiceAvatar } from "@/components/voice-avatar/voice-avatar";

import { useTTSVoices } from "../contexts/tts-voices-context";
import { ttsFormOptions } from "./text-to-speech-form";

const PROVIDER_LABELS: Record<string, string> = {
  CHATTERBOX: "",
  MIMO: "MiMo",
  ELEVENLABS: "ElevenLabs",
  MINIMAX: "MiniMax",
};

function ProviderBadge({ provider }: { provider: string }) {
  const label = PROVIDER_LABELS[provider];
  if (!label) return null;
  return (
    <span className="ml-1 rounded bg-muted px-1 py-0.5 text-[10px] font-medium text-muted-foreground">
      {label}
    </span>
  );
}

export function VoiceSelector() {
  const {
    customVoices,
    systemVoices,
    allVoices: voices,
  } = useTTSVoices();

  const form = useTypedAppFormContext(ttsFormOptions);
  const voiceId = useStore(form.store, (s) => s.values.voiceId);
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  const selectedVoice = voices.find((v) => v.id === voiceId);
  const hasMissingSelectedVoice = Boolean(voiceId) && !selectedVoice;
  const currentVoice = selectedVoice
    ? selectedVoice
    : hasMissingSelectedVoice
      ? {
        id: voiceId,
        name: "Unavailable voice",
        category: null as null,
        provider: "CHATTERBOX" as string,
      }
      : voices[0];

  // Group system voices by provider
  const chatterboxVoices = systemVoices.filter(
    (v) => !v.provider || v.provider === "CHATTERBOX",
  );
  const mimoVoices = systemVoices.filter((v) => v.provider === "MIMO");
  const elevenlabsVoices = systemVoices.filter(
    (v) => v.provider === "ELEVENLABS",
  );
  const minimaxVoices = systemVoices.filter((v) => v.provider === "MINIMAX");

  return (
    <Field>
      <FieldLabel>Voice style</FieldLabel>
      <Select
        value={voiceId}
        onValueChange={(v) => form.setFieldValue("voiceId", v)}
        disabled={isSubmitting}
      >
        <SelectTrigger className="w-full h-auto gap-1 rounded-lg bg-white px-2 py-1">
          <SelectValue>
            {currentVoice && (
              <>
                <VoiceAvatar
                  seed={currentVoice.id}
                  name={currentVoice.name}
                />
                <span className="truncate text-sm font-medium tracking-tight">
                  {currentVoice.name}
                  {currentVoice.category &&
                    ` - ${VOICE_CATEGORY_LABELS[currentVoice.category]}`
                  }
                </span>
                {currentVoice.provider &&
                  currentVoice.provider !== "CHATTERBOX" && (
                    <ProviderBadge provider={currentVoice.provider} />
                  )}
              </>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {hasMissingSelectedVoice && currentVoice && (
            <>
              <SelectGroup>
                <SelectLabel>Selected Voice</SelectLabel>
                <SelectItem value={currentVoice.id}>
                  <VoiceAvatar
                    seed={currentVoice.id}
                    name={currentVoice.name}
                  />
                  <span className="truncate text-sm font-medium">
                    {currentVoice.name}
                  </span>
                </SelectItem>
              </SelectGroup>
              {(customVoices.length > 0 || systemVoices.length > 0) && (
                <SelectSeparator />
              )}
            </>
          )}
          {customVoices.length > 0 && (
            <SelectGroup>
              <SelectLabel>Team Voices</SelectLabel>
              {customVoices.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  <VoiceAvatar seed={v.id} name={v.name} />
                  <span className="truncate text-sm font-medium">
                    {v.name} - {VOICE_CATEGORY_LABELS[v.category]}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          {customVoices.length > 0 && systemVoices.length > 0 && (
            <SelectSeparator />
          )}
          {chatterboxVoices.length > 0 && (
            <SelectGroup>
              <SelectLabel>Chatterbox Voices</SelectLabel>
              {chatterboxVoices.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  <VoiceAvatar seed={v.id} name={v.name} />
                  <span className="truncate text-sm font-medium">
                    {v.name} - {VOICE_CATEGORY_LABELS[v.category]}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          )}
          {mimoVoices.length > 0 && (
            <>
              {chatterboxVoices.length > 0 && <SelectSeparator />}
              <SelectGroup>
                <SelectLabel>MiMo Voices</SelectLabel>
                {mimoVoices.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    <VoiceAvatar seed={v.id} name={v.name} />
                    <span className="truncate text-sm font-medium">
                      {v.name}
                      <ProviderBadge provider="MIMO" />
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </>
          )}
          {elevenlabsVoices.length > 0 && (
            <>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>ElevenLabs Voices</SelectLabel>
                {elevenlabsVoices.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    <VoiceAvatar seed={v.id} name={v.name} />
                    <span className="truncate text-sm font-medium">
                      {v.name}
                      <ProviderBadge provider="ELEVENLABS" />
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </>
          )}
          {minimaxVoices.length > 0 && (
            <>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>MiniMax Voices</SelectLabel>
                {minimaxVoices.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    <VoiceAvatar seed={v.id} name={v.name} />
                    <span className="truncate text-sm font-medium">
                      {v.name}
                      <ProviderBadge provider="MINIMAX" />
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </>
          )}
        </SelectContent>
      </Select>
    </Field>
  );
}
