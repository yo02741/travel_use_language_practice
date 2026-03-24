<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { SCENARIOS, type ScenarioId } from "@/types/scenario";
import { useScenarioData } from "@/composables/useScenarioData";
import { useProgressStore } from "@/stores/progress";

const route = useRoute();
const router = useRouter();
const progress = useProgressStore();
const { conversations, loading, load } = useScenarioData();

const scenarioId = computed(() => route.params.id as ScenarioId);
const scenario = computed(() => SCENARIOS.find((s) => s.id === scenarioId.value));

onMounted(() => {
  load(scenarioId.value);
});

const difficultyLabel = (d: number) =>
  d === 1 ? "基礎" : d === 2 ? "進階" : "挑戰";

function goPhrase(index: number) {
  router.push(`/scenario/${scenarioId.value}/phrase/${index}`);
}

function goDialog(index: number) {
  router.push(`/scenario/${scenarioId.value}/dialog/${index}`);
}

function resetProgress() {
  if (confirm(`確定要重置「${scenario.value?.name}」的學習進度嗎？`)) {
    progress.resetScenario(scenarioId.value);
  }
}
</script>

<template>
  <div v-if="scenario">
    <div class="flex items-center gap-2 mb-4">
      <button class="text-(--color-text-secondary)" @click="router.push('/')">← 返回</button>
    </div>

    <div class="flex items-center gap-3 mb-4">
      <span class="text-3xl">{{ scenario.icon }}</span>
      <div>
        <h2 class="text-xl font-bold">{{ scenario.name }}</h2>
        <p class="text-sm text-(--color-text-secondary)">
          {{ progress.scenarioProgress(scenarioId, conversations.length).completed }}/{{ conversations.length }} 完成
        </p>
      </div>
    </div>

    <div class="mb-4">
      <button
        class="text-xs text-(--color-text-secondary) underline"
        @click="resetProgress"
      >重置此場景進度</button>
    </div>

    <div v-if="loading" class="text-center py-8 text-(--color-text-secondary)">載入中...</div>

    <div v-else class="space-y-2">
      <div
        v-for="(conv, idx) in conversations"
        :key="conv.id"
        class="rounded-xl bg-(--color-card) border border-(--color-border) p-3 shadow-sm"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span
                v-if="progress.isConversationCompleted(scenarioId, conv.id)"
                class="text-xs px-1.5 py-0.5 rounded-full bg-(--color-success)/10 text-(--color-success)"
              >✓</span>
              <span class="font-medium text-sm">{{ conv.title }}</span>
            </div>
            <span
              class="inline-block mt-1 text-xs px-2 py-0.5 rounded-full"
              :class="{
                'bg-green-50 text-green-700': conv.difficulty === 1,
                'bg-amber-50 text-amber-700': conv.difficulty === 2,
                'bg-red-50 text-red-700': conv.difficulty === 3,
              }"
            >{{ difficultyLabel(conv.difficulty) }}</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button
            class="flex-1 text-xs py-1.5 rounded-lg border border-(--color-border) transition-colors hover:bg-gray-50 active:bg-gray-100"
            @click="goPhrase(idx)"
          >📖 跟讀</button>
          <button
            class="flex-1 text-xs py-1.5 rounded-lg border border-(--color-border) transition-colors hover:bg-gray-50 active:bg-gray-100"
            @click="goDialog(idx)"
          >💬 模擬對話</button>
        </div>
      </div>
    </div>
  </div>
</template>
