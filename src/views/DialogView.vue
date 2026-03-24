<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { ScenarioId } from "@/types/scenario";
import { SCENARIOS } from "@/types/scenario";
import { useScenarioData } from "@/composables/useScenarioData";
import { useProgressStore } from "@/stores/progress";

const route = useRoute();
const router = useRouter();
const progress = useProgressStore();
const { conversations, load } = useScenarioData();

const scenarioId = computed(() => route.params.id as ScenarioId);
const convIndex = computed(() => Number(route.params.n));
const scenario = computed(() =>
  SCENARIOS.find((s) => s.id === scenarioId.value),
);

const revealedPhrases = ref<Set<number>>(new Set());
const completed = ref(false);

onMounted(() => load(scenarioId.value));

const conversation = computed(() => conversations.value[convIndex.value]);

function reveal(index: number) {
  revealedPhrases.value.add(index);
  // Check if all "you" phrases are revealed
  if (conversation.value) {
    const allRevealed = conversation.value.phrases.every(
      (p, i) => p.speaker === "staff" || revealedPhrases.value.has(i),
    );
    if (allRevealed) {
      completed.value = true;
      progress.markConversationCompleted(
        scenarioId.value,
        conversation.value.id,
      );
    }
  }
}

function goBack() {
  router.push(`/scenario/${scenarioId.value}`);
}

function goNext() {
  if (convIndex.value < conversations.value.length - 1) {
    revealedPhrases.value.clear();
    completed.value = false;
    router.push(`/scenario/${scenarioId.value}/dialog/${convIndex.value + 1}`);
  } else {
    goBack();
  }
}
</script>

<template>
  <div v-if="conversation">
    <div class="flex items-center gap-2 mb-4">
      <button class="text-(--color-text-secondary) cursor-pointer" @click="goBack">
        ← 返回
      </button>
      <span class="text-sm text-(--color-text-secondary)">
        {{ scenario?.icon }} {{ conversation.title }}
      </span>
    </div>

    <div class="space-y-3 pb-4">
      <div
        v-for="(phrase, idx) in conversation.phrases"
        :key="idx"
        class="flex"
        :class="phrase.speaker === 'you' ? 'justify-end' : 'justify-start'"
      >
        <div
          class="max-w-[85%] rounded-2xl px-4 py-3"
          :class="
            phrase.speaker === 'you'
              ? 'bg-blue-50 dark:bg-blue-950 rounded-br-md'
              : 'bg-orange-50 dark:bg-orange-950 rounded-bl-md'
          "
        >
          <!-- Speaker label -->
          <div class="text-xs mb-1 opacity-60">
            {{ phrase.speaker === "you" ? "🙋 你" : `${scenario?.staffIcon} ${scenario?.staffLabel}` }}
          </div>

          <!-- Staff phrases always visible -->
          <template v-if="phrase.speaker === 'staff'">
            <div class="font-bold font-(--font-jp) text-base leading-relaxed">
              {{ phrase.japanese.text }}
            </div>
            <div class="text-xs text-(--color-text-secondary) mt-0.5">
              {{ phrase.japanese.romaji }}
            </div>
            <div class="text-sm mt-1">{{ phrase.english }}</div>
            <div class="text-xs text-(--color-text-secondary) mt-0.5">
              {{ phrase.chinese }}
            </div>
          </template>

          <!-- User phrases: hidden until tapped -->
          <template v-else>
            <div v-if="revealedPhrases.has(idx)">
              <div class="font-bold font-(--font-jp) text-base leading-relaxed">
                {{ phrase.japanese.text }}
              </div>
              <div class="text-xs text-(--color-text-secondary) mt-0.5">
                {{ phrase.japanese.romaji }}
              </div>
              <div class="text-sm mt-1">{{ phrase.english }}</div>
              <div class="text-xs text-(--color-text-secondary) mt-0.5">
                {{ phrase.chinese }}
              </div>
            </div>
            <button
              v-else
              class="w-full text-center py-3 text-sm text-blue-500 font-medium cursor-pointer"
              @click="reveal(idx)"
            >
              👆 點擊查看你的回答
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Completion -->
    <div
      v-if="completed"
      class="rounded-2xl glass p-5 text-center border border-(--color-success)/20"
    >
      <div class="text-2xl mb-2">🎉</div>
      <div class="font-bold text-lg mb-1">完成！</div>
      <p class="text-sm text-(--color-text-secondary) mb-4">
        這組對話已標記為完成
      </p>
      <div class="flex gap-3 justify-center">
        <button
          class="px-4 py-2 rounded-lg text-sm border border-(--color-border) cursor-pointer"
          @click="goBack"
        >
          回到列表
        </button>
        <button
          v-if="convIndex < conversations.length - 1"
          class="px-4 py-2 rounded-lg text-sm bg-(--color-success) text-white cursor-pointer"
          @click="goNext"
        >
          下一組 →
        </button>
      </div>
    </div>
  </div>
</template>
