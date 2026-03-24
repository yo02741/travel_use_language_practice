import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ScenarioId } from "@/types/scenario";
import type { KanaProficiency } from "@/types/kana";

const STORAGE_KEY = "travel-lang-progress";

interface ProgressData {
  scenarios: Record<string, string[]>; // scenarioId -> completed conversation ids
  phraseFamiliarity: Record<string, string[]>; // scenarioId -> familiar phrase keys
  kana: Record<string, KanaProficiency>; // kana char -> proficiency
}

function loadFromStorage(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { scenarios: {}, phraseFamiliarity: {}, kana: {} };
}

function saveToStorage(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const useProgressStore = defineStore("progress", () => {
  const data = ref<ProgressData>(loadFromStorage());

  function persist() {
    saveToStorage(data.value);
  }

  // Scenario progress
  function completedConversations(scenarioId: ScenarioId): string[] {
    return data.value.scenarios[scenarioId] ?? [];
  }

  function isConversationCompleted(
    scenarioId: ScenarioId,
    conversationId: string,
  ): boolean {
    return completedConversations(scenarioId).includes(conversationId);
  }

  function markConversationCompleted(
    scenarioId: ScenarioId,
    conversationId: string,
  ) {
    if (!data.value.scenarios[scenarioId]) {
      data.value.scenarios[scenarioId] = [];
    }
    if (!data.value.scenarios[scenarioId].includes(conversationId)) {
      data.value.scenarios[scenarioId].push(conversationId);
      persist();
    }
  }

  function scenarioProgress(scenarioId: ScenarioId, total: number) {
    const completed = completedConversations(scenarioId).length;
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }

  // Phrase familiarity
  function isPhraseFamiliar(scenarioId: ScenarioId, phraseKey: string): boolean {
    return (data.value.phraseFamiliarity[scenarioId] ?? []).includes(phraseKey);
  }

  function togglePhraseFamiliar(scenarioId: ScenarioId, phraseKey: string) {
    if (!data.value.phraseFamiliarity[scenarioId]) {
      data.value.phraseFamiliarity[scenarioId] = [];
    }
    const list = data.value.phraseFamiliarity[scenarioId];
    const idx = list.indexOf(phraseKey);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(phraseKey);
    }
    persist();
  }

  // Kana proficiency
  function kanaProficiency(kana: string): KanaProficiency {
    return data.value.kana[kana] ?? "unlearned";
  }

  function setKanaProficiency(kana: string, level: KanaProficiency) {
    data.value.kana[kana] = level;
    persist();
  }

  const kanaStats = computed(() => {
    const entries = Object.values(data.value.kana);
    return {
      mastered: entries.filter((v) => v === "mastered").length,
      needsWork: entries.filter((v) => v === "needs_work").length,
      unlearned: entries.filter((v) => v === "unlearned").length,
    };
  });

  // Reset
  function resetScenario(scenarioId: ScenarioId) {
    delete data.value.scenarios[scenarioId];
    delete data.value.phraseFamiliarity[scenarioId];
    persist();
  }

  function resetAll() {
    data.value = { scenarios: {}, phraseFamiliarity: {}, kana: {} };
    persist();
  }

  return {
    completedConversations,
    isConversationCompleted,
    markConversationCompleted,
    scenarioProgress,
    isPhraseFamiliar,
    togglePhraseFamiliar,
    kanaProficiency,
    setKanaProficiency,
    kanaStats,
    resetScenario,
    resetAll,
  };
});
