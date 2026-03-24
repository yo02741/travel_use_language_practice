<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ScenarioId } from "@/types/scenario";
import { SCENARIOS } from "@/types/scenario";
import { useScenarioData } from "@/composables/useScenarioData";
import { useProgressStore } from "@/stores/progress";
import { useSlotReplace } from "@/composables/useSlotReplace";
import SlotPicker from "@/components/SlotPicker.vue";

const route = useRoute();
const router = useRouter();
const progress = useProgressStore();
const { conversations, load } = useScenarioData();

const scenarioId = computed(() => route.params.id as ScenarioId);
const convIndex = computed(() => Number(route.params.n));
const scenario = computed(() =>
  SCENARIOS.find((s) => s.id === scenarioId.value),
);

const currentPhraseIdx = ref(0);
const touchStartX = ref(0);

onMounted(() => load(scenarioId.value));

const conversation = computed(() => conversations.value[convIndex.value]);
const currentPhrase = computed(
  () => conversation.value?.phrases[currentPhraseIdx.value],
);
const totalPhrases = computed(() => conversation.value?.phrases.length ?? 0);

const { selections, select, reset, displayPhrase } = useSlotReplace(
  () => currentPhrase.value,
);

const phraseKey = computed(
  () => `${conversation.value?.id}-${currentPhraseIdx.value}`,
);

watch(currentPhraseIdx, () => {
  reset();
});

watch(convIndex, () => {
  currentPhraseIdx.value = 0;
  reset();
});

function prev() {
  if (currentPhraseIdx.value > 0) currentPhraseIdx.value--;
}

function next() {
  if (currentPhraseIdx.value < totalPhrases.value - 1) {
    currentPhraseIdx.value++;
  }
}

const isLastPhrase = computed(
  () => currentPhraseIdx.value === totalPhrases.value - 1,
);

function finish() {
  if (conversation.value) {
    progress.markConversationCompleted(scenarioId.value, conversation.value.id);
  }
  router.push(`/scenario/${scenarioId.value}`);
}

function onTouchStart(e: TouchEvent) {
  touchStartX.value = e.touches[0]!.clientX;
}

function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0]!.clientX - touchStartX.value;
  if (Math.abs(dx) > 50) {
    if (dx > 0) prev();
    else next();
  }
}

function goBack() {
  router.push(`/scenario/${scenarioId.value}`);
}
</script>

<template>
  <div
    v-if="conversation && displayPhrase"
    class="flex flex-col"
    style="min-height: calc(100dvh - 120px)"
  >
    <div class="flex items-center gap-2 mb-4">
      <button class="text-(--color-text-secondary)" @click="goBack">
        ← 返回
      </button>
      <span class="text-sm text-(--color-text-secondary)">
        {{ scenario?.icon }} {{ conversation.title }}
      </span>
    </div>

    <div class="text-center text-sm text-(--color-text-secondary) mb-3">
      {{ currentPhraseIdx + 1 }} / {{ totalPhrases }}
    </div>

    <!-- Card area: fills remaining space -->
    <div
      class="flex-1 rounded-2xl bg-(--color-card) border border-(--color-border) shadow-sm p-5 flex flex-col justify-center"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <!-- Speaker label -->
      <div class="text-center mb-4">
        <span
          class="inline-block text-xs px-3 py-1 rounded-full font-medium"
          :class="
            displayPhrase.speaker === 'you'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
              : 'bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300'
          "
        >
          {{ displayPhrase.speaker === "you" ? "🙋 你" : "🧑‍💼 店員" }}
        </span>
      </div>

      <!-- Japanese -->
      <div class="text-center space-y-1 mb-5">
        <div class="text-2xl font-bold font-(--font-jp) leading-relaxed">
          {{ displayPhrase.japanese.text }}
        </div>
        <div
          v-if="displayPhrase.japanese.reading !== displayPhrase.japanese.text"
          class="text-sm text-(--color-text-secondary) font-(--font-jp)"
        >
          {{ displayPhrase.japanese.reading }}
        </div>
        <div class="text-xs text-(--color-text-secondary) tracking-wide">
          {{ displayPhrase.japanese.romaji }}
        </div>
      </div>

      <!-- English -->
      <div class="text-center text-base text-(--color-text-secondary) mb-2">
        {{ displayPhrase.english }}
      </div>

      <!-- Chinese -->
      <div class="text-center text-sm text-(--color-text-secondary)/70">
        {{ displayPhrase.chinese }}
      </div>

      <!-- Slot Picker -->
      <div
        v-if="currentPhrase?.slots?.length"
        class="mt-5 pt-4 border-t border-(--color-border)"
      >
        <p class="text-xs text-(--color-text-secondary) mb-2">🔄 替換詞彙</p>
        <SlotPicker
          :slots="currentPhrase.slots"
          :selections="selections"
          @select="select"
        />
      </div>

      <!-- Familiar toggle -->
      <div class="text-center mt-5">
        <button
          class="text-xs px-4 py-1.5 rounded-full border transition-colors"
          :class="
            progress.isPhraseFamiliar(scenarioId, phraseKey)
              ? 'bg-(--color-success)/10 border-(--color-success)/30 text-(--color-success)'
              : 'border-(--color-border) text-(--color-text-secondary)'
          "
          @click="progress.togglePhraseFamiliar(scenarioId, phraseKey)"
        >
          {{
            progress.isPhraseFamiliar(scenarioId, phraseKey)
              ? "✓ 已熟悉"
              : "標記為已熟悉"
          }}
        </button>
      </div>
    </div>

    <!-- Navigation: fixed at bottom -->
    <div class="mt-auto pt-4 pb-2">
      <div class="flex justify-between items-center">
        <button
          class="px-4 py-2 rounded-lg text-sm border border-(--color-border) disabled:opacity-30"
          :disabled="currentPhraseIdx === 0"
          @click="prev"
        >
          ← 上一句
        </button>
        <button
          v-if="!isLastPhrase"
          class="px-4 py-2 rounded-lg text-sm border border-(--color-border)"
          @click="next"
        >
          下一句 →
        </button>
        <button
          v-else
          class="px-4 py-2 rounded-lg text-sm bg-(--color-success) text-white"
          @click="finish"
        >
          完成 ✓
        </button>
      </div>
      <p class="text-center text-xs text-(--color-text-secondary) mt-2">
        ← 左右滑動切換 →
      </p>
    </div>
  </div>
</template>
