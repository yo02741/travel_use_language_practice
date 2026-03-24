export interface JapaneseText {
  text: string;
  reading: string;
  romaji: string;
}

export interface VocabOption {
  japanese: string;
  reading: string;
  romaji: string;
  english: string;
  chinese: string;
}

export interface VocabSlot {
  label: string;
  options: VocabOption[];
}

export interface Phrase {
  speaker: "you" | "staff";
  japanese: JapaneseText;
  english: string;
  chinese: string;
  slots?: VocabSlot[];
}

export interface Conversation {
  id: string;
  title: string;
  difficulty: 1 | 2 | 3;
  phrases: Phrase[];
}

export type ScenarioId =
  | "dining"
  | "accommodation"
  | "shopping"
  | "transportation";

export interface ScenarioMeta {
  id: ScenarioId;
  name: string;
  icon: string;
  color: string;
  staffLabel: string;
  staffIcon: string;
}

export const SCENARIOS: ScenarioMeta[] = [
  { id: "dining", name: "點餐", icon: "🍜", color: "var(--color-dining)", staffLabel: "店員", staffIcon: "🧑‍💼" },
  {
    id: "accommodation",
    name: "住宿",
    icon: "🏨",
    color: "var(--color-accommodation)",
    staffLabel: "櫃檯人員",
    staffIcon: "🛎️",
  },
  {
    id: "shopping",
    name: "購物",
    icon: "🛍️",
    color: "var(--color-shopping)",
    staffLabel: "店員",
    staffIcon: "🧑‍💼",
  },
  {
    id: "transportation",
    name: "交通",
    icon: "🚃",
    color: "var(--color-transportation)",
    staffLabel: "站務員",
    staffIcon: "🧑‍✈️",
  },
];
