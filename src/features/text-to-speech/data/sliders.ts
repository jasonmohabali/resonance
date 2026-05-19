interface Slider {
  id: string;
  label: string;
  leftLabel: string;
  rightLabel: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

interface EmotionOption {
  id: string;
  label: string;
}

interface ProviderConfig {
  sliders: Slider[];
  emotions?: EmotionOption[];
}

export const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  CHATTERBOX: {
    sliders: [
      {
        id: "temperature",
        label: "Creativity",
        leftLabel: "Consistent",
        rightLabel: "Expressive",
        min: 0,
        max: 2,
        step: 0.1,
        defaultValue: 0.8,
      },
      {
        id: "topP",
        label: "Voice Variety",
        leftLabel: "Stable",
        rightLabel: "Dynamic",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.95,
      },
      {
        id: "topK",
        label: "Expression Range",
        leftLabel: "Subtle",
        rightLabel: "Dramatic",
        min: 1,
        max: 10000,
        step: 100,
        defaultValue: 1000,
      },
      {
        id: "repetitionPenalty",
        label: "Natural Flow",
        leftLabel: "Rhythmic",
        rightLabel: "Varied",
        min: 1,
        max: 2,
        step: 0.1,
        defaultValue: 1.2,
      },
    ],
  },
  MIMO: {
    sliders: [
      {
        id: "speed",
        label: "Speed",
        leftLabel: "Slow",
        rightLabel: "Fast",
        min: 0.25,
        max: 4.0,
        step: 0.05,
        defaultValue: 1.0,
      },
    ],
  },
  ELEVENLABS: {
    sliders: [
      {
        id: "stability",
        label: "Stability",
        leftLabel: "Variable",
        rightLabel: "Stable",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.5,
      },
      {
        id: "similarity_boost",
        label: "Similarity",
        leftLabel: "Creative",
        rightLabel: "Similar",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0.75,
      },
      {
        id: "style",
        label: "Style Exaggeration",
        leftLabel: "None",
        rightLabel: "Exaggerated",
        min: 0,
        max: 1,
        step: 0.05,
        defaultValue: 0,
      },
      {
        id: "speed",
        label: "Speed",
        leftLabel: "Slow",
        rightLabel: "Fast",
        min: 0.5,
        max: 2.0,
        step: 0.05,
        defaultValue: 1.0,
      },
    ],
  },
  MINIMAX: {
    sliders: [
      {
        id: "speed",
        label: "Speed",
        leftLabel: "Slow",
        rightLabel: "Fast",
        min: 0.5,
        max: 2.0,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        id: "vol",
        label: "Volume",
        leftLabel: "Quiet",
        rightLabel: "Loud",
        min: 0.1,
        max: 10.0,
        step: 0.1,
        defaultValue: 1.0,
      },
      {
        id: "pitch",
        label: "Pitch",
        leftLabel: "Low",
        rightLabel: "High",
        min: -12,
        max: 12,
        step: 1,
        defaultValue: 0,
      },
    ],
    emotions: [
      { id: "happy", label: "Happy" },
      { id: "sad", label: "Sad" },
      { id: "angry", label: "Angry" },
      { id: "fearful", label: "Fearful" },
      { id: "disgusted", label: "Disgusted" },
      { id: "surprised", label: "Surprised" },
      { id: "neutral", label: "Neutral" },
    ],
  },
};

// Backward compat export
export const sliders = PROVIDER_CONFIGS.CHATTERBOX.sliders;
