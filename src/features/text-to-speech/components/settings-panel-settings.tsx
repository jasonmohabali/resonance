"use client";

import { useStore } from "@tanstack/react-form";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTypedAppFormContext } from "@/hooks/use-app-form";

import { PROVIDER_CONFIGS } from "@/features/text-to-speech/data/sliders";
import { ttsFormOptions } from "@/features/text-to-speech/components/text-to-speech-form";
import { VoiceSelector } from "@/features/text-to-speech/components/voice-selector";
import { useTTSVoices } from "../contexts/tts-voices-context";

export function SettingsPanelSettings() {
  const form = useTypedAppFormContext(ttsFormOptions);
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);
  const voiceId = useStore(form.store, (s) => s.values.voiceId);
  const settings = useStore(form.store, (s) => s.values.settings) ?? {};

  const { allVoices } = useTTSVoices();
  const selectedVoice = allVoices.find((v) => v.id === voiceId);
  const provider = selectedVoice?.provider ?? "CHATTERBOX";
  const config = PROVIDER_CONFIGS[provider] ?? PROVIDER_CONFIGS.CHATTERBOX;

  const handleSettingChange = (key: string, value: unknown) => {
    form.setFieldValue("settings", { ...settings, [key]: value });
  };

  return (
    <>
      {/* Voice Style Dropdown Section */}
      <div className="border-b border-dashed p-4">
        <VoiceSelector />
      </div>

      {/* Voice Adjustments Section */}
      <div className="p-4 flex-1">
        <FieldGroup className="gap-8">
          {config.sliders.map((slider) => (
            <Field key={slider.id}>
              <FieldLabel>{slider.label}</FieldLabel>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {slider.leftLabel}
                </span>
                <span className="text-xs text-muted-foreground">
                  {slider.rightLabel}
                </span>
              </div>
              <Slider
                value={[
                  (settings[slider.id] as number) ?? slider.defaultValue,
                ]}
                onValueChange={(value) =>
                  handleSettingChange(slider.id, value[0])
                }
                min={slider.min}
                max={slider.max}
                step={slider.step}
                disabled={isSubmitting}
                className="**:data-[slot=slider-thumb]:size-3 **:data-[slot=slider-thumb]:bg-foreground **:data-[slot=slider-track]:h-1"
              />
            </Field>
          ))}

          {/* MiniMax emotion dropdown */}
          {config.emotions && config.emotions.length > 0 && (
            <Field>
              <FieldLabel>Emotion</FieldLabel>
              <Select
                value={(settings.emotion as string) ?? "neutral"}
                onValueChange={(value) =>
                  handleSettingChange("emotion", value)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {config.emotions.map((emotion) => (
                    <SelectItem key={emotion.id} value={emotion.id}>
                      {emotion.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        </FieldGroup>
      </div>
    </>
  );
}
