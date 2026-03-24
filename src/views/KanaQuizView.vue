<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import type { KanaEntry } from "@/types/kana";

const router = useRouter();

const TOTAL_QUESTIONS = 20;
const allKana = ref<KanaEntry[]>([]);
const questions = ref<KanaEntry[]>([]);
const currentIdx = ref(0);
const options = ref<string[]>([]);
const selected = ref<string | null>(null);
const results = ref<{ kana: string; correct: boolean }[]>([]);
const startTime = ref(0);
const endTime = ref(0);

onMounted(async () => {
  const mod = await import("@/data/kana/hiragana.json");
  allKana.value = mod.default as KanaEntry[];
  startQuiz();
});

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startQuiz() {
  questions.value = shuffle(allKana.value).slice(0, TOTAL_QUESTIONS);
  currentIdx.value = 0;
  selected.value = null;
  results.value = [];
  startTime.value = Date.now();
  endTime.value = 0;
  generateOptions();
}

function generateOptions() {
  const correct = questions.value[currentIdx.value].romaji;
  const others = shuffle(
    allKana.value.filter((k) => k.romaji !== correct).map((k) => k.romaji),
  )
    .filter((v, i, a) => a.indexOf(v) === i)
    .slice(0, 3);
  options.value = shuffle([correct, ...others]);
}

const current = computed(() => questions.value[currentIdx.value]);
const isFinished = computed(() => results.value.length === TOTAL_QUESTIONS);

const correctCount = computed(
  () => results.value.filter((r) => r.correct).length,
);
const elapsedSeconds = computed(() =>
  Math.round((endTime.value - startTime.value) / 1000),
);
const wrongKana = computed(() =>
  results.value.filter((r) => !r.correct).map((r) => r.kana),
);

function selectAnswer(romaji: string) {
  if (selected.value) return;
  selected.value = romaji;
  const correct = romaji === current.value.romaji;
  results.value.push({ kana: current.value.kana, correct });

  setTimeout(() => {
    if (currentIdx.value < TOTAL_QUESTIONS - 1) {
      currentIdx.value++;
      selected.value = null;
      generateOptions();
    } else {
      endTime.value = Date.now();
    }
  }, 600);
}

function optionClass(romaji: string): string {
  if (!selected.value) return "bg-(--color-card) border border-(--color-border)";
  if (romaji === current.value.romaji)
    return "bg-(--color-success)/10 border border-(--color-success) text-(--color-success)";
  if (romaji === selected.value)
    return "bg-red-50 border border-red-300 text-red-600";
  return "bg-(--color-card) border border-(--color-border) opacity-40";
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-4">
      <button class="text-(--color-text-secondary)" @click="router.push('/kana')">← 返回</button>
      <span class="text-sm text-(--color-text-secondary)">隨機測驗</span>
    </div>

    <!-- Quiz in progress -->
    <template v-if="!isFinished && current">
      <div class="text-center text-sm text-(--color-text-secondary) mb-4">
        {{ currentIdx + 1 }} / {{ TOTAL_QUESTIONS }}
      </div>

      <div class="rounded-2xl bg-(--color-card) border border-(--color-border) shadow-sm p-8 text-center mb-6">
        <div class="text-7xl font-(--font-jp)">{{ current.kana }}</div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="opt in options"
          :key="opt"
          class="py-4 rounded-xl text-lg font-medium transition-all active:scale-95"
          :class="optionClass(opt)"
          :disabled="!!selected"
          @click="selectAnswer(opt)"
        >{{ opt }}</button>
      </div>
    </template>

    <!-- Results -->
    <template v-if="isFinished">
      <div class="rounded-2xl bg-(--color-card) border border-(--color-border) shadow-sm p-6 text-center">
        <div class="text-3xl mb-2">🎯</div>
        <div class="text-2xl font-bold mb-1">
          {{ correctCount }} / {{ TOTAL_QUESTIONS }}
        </div>
        <div class="text-sm text-(--color-text-secondary) mb-4">
          正確率 {{ Math.round((correctCount / TOTAL_QUESTIONS) * 100) }}% · 用時 {{ elapsedSeconds }} 秒
        </div>

        <div v-if="wrongKana.length > 0" class="mb-4">
          <p class="text-sm font-medium mb-2">最常錯的假名：</p>
          <div class="flex gap-2 justify-center flex-wrap">
            <span
              v-for="k in wrongKana"
              :key="k"
              class="inline-block px-3 py-1 rounded-lg bg-red-50 text-red-600 font-(--font-jp) text-lg"
            >{{ k }}</span>
          </div>
        </div>

        <div class="flex gap-3 justify-center">
          <button
            class="px-4 py-2 rounded-lg text-sm border border-(--color-border)"
            @click="router.push('/kana')"
          >回到五十音</button>
          <button
            class="px-4 py-2 rounded-lg text-sm bg-(--color-kana) text-white"
            @click="startQuiz"
          >再測一次</button>
        </div>
      </div>
    </template>
  </div>
</template>
