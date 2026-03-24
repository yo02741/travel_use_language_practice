<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProgressStore } from "@/stores/progress";
import type { KanaEntry, KanaType } from "@/types/kana";

const route = useRoute();
const router = useRouter();
const progress = useProgressStore();

const kanaType = computed(() => route.params.type as KanaType);
const entries = ref<KanaEntry[]>([]);
const currentIdx = ref(0);
const flipped = ref(false);

onMounted(async () => {
  const mod =
    kanaType.value === "hiragana"
      ? await import("@/data/kana/hiragana.json")
      : await import("@/data/kana/katakana.json");
  // Prioritize "needs_work" entries, then "unlearned", then "mastered"
  entries.value = sortByProficiency(mod.default as KanaEntry[]);
});

function sortByProficiency(list: KanaEntry[]): KanaEntry[] {
  const order = { needs_work: 0, unlearned: 1, mastered: 2 };
  return [...list].sort(
    (a, b) =>
      order[progress.kanaProficiency(a.kana)] -
      order[progress.kanaProficiency(b.kana)],
  );
}

const current = computed(() => entries.value[currentIdx.value]);

function flip() {
  flipped.value = !flipped.value;
}

function markAndNext(level: "mastered" | "needs_work") {
  if (current.value) {
    progress.setKanaProficiency(current.value.kana, level);
  }
  flipped.value = false;
  if (currentIdx.value < entries.value.length - 1) {
    currentIdx.value++;
  } else {
    currentIdx.value = 0;
    entries.value = sortByProficiency(entries.value);
  }
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-4">
      <button
        class="text-(--color-text-secondary)"
        @click="router.push('/kana')"
      >
        ← 返回
      </button>
      <span class="text-sm text-(--color-text-secondary)">
        {{ kanaType === "hiragana" ? "平假名" : "片假名" }}字卡
      </span>
    </div>

    <div class="text-center text-sm text-(--color-text-secondary) mb-3">
      {{ currentIdx + 1 }} / {{ entries.length }}
    </div>

    <div v-if="current">
      <button
        class="w-full rounded-2xl bg-(--color-card) border border-(--color-border) shadow-sm p-8 min-h-[280px] flex flex-col items-center justify-center transition-all duration-200 active:scale-95"
        @click="flip"
      >
        <!-- Front -->
        <div v-if="!flipped" class="text-center">
          <div class="text-7xl font-(--font-jp) mb-4">{{ current.kana }}</div>
          <p class="text-sm text-(--color-text-secondary)">點擊翻轉查看答案</p>
        </div>

        <!-- Back -->
        <div v-else class="text-center">
          <div class="text-5xl font-(--font-jp) mb-2">{{ current.kana }}</div>
          <div class="text-3xl font-bold text-(--color-kana) mb-2">
            {{ current.romaji }}
          </div>
          <div class="text-sm text-(--color-text-secondary)">
            {{ current.row }}
          </div>
        </div>
      </button>
    </div>

    <!-- Action buttons (show when flipped) -->
    <div v-if="flipped" class="flex gap-3 mt-4">
      <button
        class="flex-1 py-3 rounded-xl text-sm font-medium bg-(--color-warning)/10 text-(--color-warning) border border-(--color-warning)/20 active:scale-95 transition-transform"
        @click="markAndNext('needs_work')"
      >
        😅 需加強
      </button>
      <button
        class="flex-1 py-3 rounded-xl text-sm font-medium bg-(--color-success)/10 text-(--color-success) border border-(--color-success)/20 active:scale-95 transition-transform"
        @click="markAndNext('mastered')"
      >
        ✓ 已熟悉
      </button>
    </div>
  </div>
</template>
