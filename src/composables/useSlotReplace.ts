import { reactive, computed } from "vue";
import type { Phrase, VocabSlot } from "@/types/scenario";

export function useSlotReplace(getPhrase: () => Phrase | undefined) {
  const selections = reactive<Record<string, number>>({});

  function reset() {
    Object.keys(selections).forEach((k) => delete selections[k]);
  }

  function select(label: string, index: number) {
    selections[label] = index;
  }

  const displayPhrase = computed(() => {
    const phrase = getPhrase();
    if (!phrase) return null;
    if (!phrase.slots || phrase.slots.length === 0) return phrase;

    let jpText = phrase.japanese.text;
    let jpReading = phrase.japanese.reading;
    let jpRomaji = phrase.japanese.romaji;
    let en = phrase.english;
    let zh = phrase.chinese;

    for (const slot of phrase.slots) {
      const defaultOpt = slot.options[0];
      const selectedIdx = selections[slot.label] ?? 0;
      const selectedOpt = slot.options[selectedIdx];

      if (selectedIdx !== 0 && defaultOpt && selectedOpt) {
        jpText = jpText.replace(defaultOpt.japanese, selectedOpt.japanese);
        jpReading = jpReading.replace(defaultOpt.reading, selectedOpt.reading);
        jpRomaji = jpRomaji.replace(defaultOpt.romaji, selectedOpt.romaji);
        en = en.replace(defaultOpt.english, selectedOpt.english);
        zh = zh.replace(defaultOpt.chinese, selectedOpt.chinese);
      }
    }

    return {
      ...phrase,
      japanese: { text: jpText, reading: jpReading, romaji: jpRomaji },
      english: en,
      chinese: zh,
    };
  });

  return { selections, select, reset, displayPhrase };
}
