import { ref } from "vue";
import type { Conversation, ScenarioId } from "@/types/scenario";

const cache = new Map<ScenarioId, Conversation[]>();

export function useScenarioData() {
  const conversations = ref<Conversation[]>([]);
  const loading = ref(false);

  async function load(scenarioId: ScenarioId) {
    if (cache.has(scenarioId)) {
      conversations.value = cache.get(scenarioId)!;
      return;
    }
    loading.value = true;
    const modules: Record<
      ScenarioId,
      () => Promise<{ default: Conversation[] }>
    > = {
      dining: () =>
        import("@/data/scenarios/dining.json") as Promise<{
          default: Conversation[];
        }>,
      accommodation: () =>
        import("@/data/scenarios/accommodation.json") as Promise<{
          default: Conversation[];
        }>,
      shopping: () =>
        import("@/data/scenarios/shopping.json") as Promise<{
          default: Conversation[];
        }>,
      transportation: () =>
        import("@/data/scenarios/transportation.json") as Promise<{
          default: Conversation[];
        }>,
    };
    const mod = await modules[scenarioId]();
    cache.set(scenarioId, mod.default);
    conversations.value = mod.default;
    loading.value = false;
  }

  return { conversations, loading, load };
}
