<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useProgressStore } from "@/stores/progress";
import type { KanaEntry } from "@/types/kana";

const router = useRouter();
const progress = useProgressStore();

const hiragana = ref<KanaEntry[]>([]);
const katakana = ref<KanaEntry[]>([]);
const showType = ref<"hiragana" | "katakana">("hiragana");

onMounted(async () => {
  const [h, k] = await Promise.all([
    import("@/data/kana/hiragana.json"),
    import("@/data/kana/katakana.json"),
  ]);
  hiragana.value = h.default as KanaEntry[];
  katakana.value = k.default as KanaEntry[];
});

const ROWS = [
  "あ行", "か行", "さ行", "た行", "な行",
  "は行", "ま行", "や行", "ら行", "わ行", "ん",
  "が行", "ざ行", "だ行", "ば行", "ぱ行",
];
const KATA_ROWS = [
  "ア行", "カ行", "サ行", "タ行", "ナ行",
  "ハ行", "マ行", "ヤ行", "ラ行", "ワ行", "ン",
  "ガ行", "ザ行", "ダ行", "バ行", "パ行",
];

const COLS = ["あ段", "い段", "う段", "え段", "お段"];
const KATA_COLS = ["ア段", "イ段", "ウ段", "エ段", "オ段"];

function getEntry(entries: KanaEntry[], row: string, col: string) {
  return entries.find((e) => e.row === row && e.column === col);
}

function proficiencyClass(kana: string): string {
  const p = progress.kanaProficiency(kana);
  if (p === "mastered") return "bg-(--color-success)/15 text-(--color-success)";
  if (p === "needs_work") return "bg-(--color-warning)/15 text-(--color-warning)";
  return "bg-gray-50 text-(--color-text)";
}
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-4">
      <button class="text-(--color-text-secondary)" @click="router.push('/kana')">← 返回</button>
      <span class="text-sm text-(--color-text-secondary)">五十音總覽</span>
    </div>

    <!-- Toggle -->
    <div class="flex gap-2 mb-4">
      <button
        class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="showType === 'hiragana' ? 'bg-(--color-kana) text-white' : 'bg-gray-100'"
        @click="showType = 'hiragana'"
      >平假名</button>
      <button
        class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
        :class="showType === 'katakana' ? 'bg-(--color-kana) text-white' : 'bg-gray-100'"
        @click="showType = 'katakana'"
      >片假名</button>
    </div>

    <!-- Legend -->
    <div class="flex gap-4 text-xs mb-3 justify-center">
      <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-(--color-success)/15" /> 已熟悉</span>
      <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-(--color-warning)/15" /> 需加強</span>
      <span class="flex items-center gap-1"><span class="w-3 h-3 rounded bg-gray-50 border border-gray-200" /> 未練習</span>
    </div>

    <!-- Chart -->
    <div class="overflow-x-auto">
      <table class="w-full text-center text-sm">
        <thead>
          <tr>
            <th class="p-1" />
            <th v-for="col in (showType === 'hiragana' ? COLS : KATA_COLS)" :key="col" class="p-1 text-xs text-(--color-text-secondary)">
              {{ col.charAt(0) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, ri) in (showType === 'hiragana' ? ROWS : KATA_ROWS)"
            :key="row"
          >
            <td class="p-1 text-xs text-(--color-text-secondary) font-medium">
              {{ row }}
            </td>
            <td
              v-for="col in (showType === 'hiragana' ? COLS : KATA_COLS)"
              :key="col"
              class="p-0.5"
            >
              <div
                v-if="getEntry(showType === 'hiragana' ? hiragana : katakana, row, col)"
                class="w-10 h-10 flex items-center justify-center rounded-lg font-(--font-jp) text-base transition-colors"
                :class="proficiencyClass(getEntry(showType === 'hiragana' ? hiragana : katakana, row, col)!.kana)"
              >
                {{ getEntry(showType === 'hiragana' ? hiragana : katakana, row, col)!.kana }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
