export interface KanaEntry {
  kana: string;
  romaji: string;
  row: string;
  column: string;
}

export type KanaType = "hiragana" | "katakana";

export type KanaProficiency = "unlearned" | "needs_work" | "mastered";
