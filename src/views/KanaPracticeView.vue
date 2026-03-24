<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
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
const showDetail = ref(false);

onMounted(async () => {
  const mod =
    kanaType.value === "hiragana"
      ? await import("@/data/kana/hiragana.json")
      : await import("@/data/kana/katakana.json");
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
  if (flipped.value) return;
  flipped.value = true;
  showDetail.value = false;
  // Wait for flip animation midpoint, then show detail
  setTimeout(() => {
    showDetail.value = true;
  }, 350);
}

function markAndNext(level: "mastered" | "needs_work") {
  if (current.value) {
    progress.setKanaProficiency(current.value.kana, level);
  }
  showDetail.value = false;
  flipped.value = false;
  // Wait for flip animation (0.6s) to finish before changing content
  setTimeout(() => {
    if (currentIdx.value < entries.value.length - 1) {
      currentIdx.value++;
    } else {
      currentIdx.value = 0;
      entries.value = sortByProficiency(entries.value);
    }
  }, 620);
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-4">
      <button
        class="text-(--color-text-secondary) cursor-pointer"
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

    <div v-if="current" class="kana-card-scene">
      <!-- Card with 3D flip -->
      <button
        class="kana-card w-full rounded-2xl min-h-[280px] cursor-pointer active:scale-[0.97] transition-transform"
        :class="{ 'is-flipped': flipped }"
        @click="flip"
      >
        <!-- Front face -->
        <div class="kana-card__face kana-card__front glass rounded-2xl p-8 flex flex-col items-center justify-center">
          <div class="text-7xl font-(--font-jp) mb-4">{{ current.kana }}</div>
          <p class="text-sm text-(--color-text-secondary)">點擊翻轉查看答案</p>
        </div>

        <!-- Back face -->
        <div class="kana-card__face kana-card__back glass rounded-2xl p-8 flex flex-col items-center justify-center">
          <div class="text-5xl font-(--font-jp) mb-3">{{ current.kana }}</div>
          <div
            class="text-center transition-opacity duration-300"
            :class="showDetail ? 'opacity-100' : 'opacity-0'"
          >
            <div class="text-3xl font-bold text-(--color-kana) mb-1">
              {{ current.romaji }}
            </div>
            <div class="text-sm text-(--color-text-secondary)">
              {{ current.row }}
            </div>
          </div>
        </div>
      </button>
    </div>

    <!-- Action buttons (always occupy space, fade in/out) -->
    <div
      class="flex gap-3 mt-4 transition-opacity duration-300"
      :class="showDetail ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <button
        class="flex-1 py-3 rounded-xl text-sm font-medium bg-(--color-warning)/10 text-(--color-warning) border border-(--color-warning)/20 active:scale-95 transition-transform cursor-pointer"
        @click="markAndNext('needs_work')"
      >
        😅 需加強
      </button>
      <button
        class="flex-1 py-3 rounded-xl text-sm font-medium bg-(--color-success)/10 text-(--color-success) border border-(--color-success)/20 active:scale-95 transition-transform cursor-pointer"
        @click="markAndNext('mastered')"
      >
        ✓ 已熟悉
      </button>
    </div>
  </div>
</template>

<style scoped>
.kana-card-scene {
  perspective: 800px;
}

.kana-card {
  position: relative;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.kana-card.is-flipped {
  transform: rotateY(180deg);
}

.kana-card__face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.kana-card__back {
  transform: rotateY(180deg);
}

</style>
