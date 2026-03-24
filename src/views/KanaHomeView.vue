<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProgressStore } from "@/stores/progress";

const router = useRouter();
const progress = useProgressStore();
</script>

<template>
  <div>
    <div class="flex items-center gap-2 mb-4">
      <button class="text-(--color-text-secondary)" @click="router.push('/')">← 返回</button>
    </div>

    <h2 class="text-xl font-bold mb-1">五十音練習</h2>
    <p class="text-sm text-(--color-text-secondary) mb-5">字卡記憶、總覽表、隨機測驗</p>

    <div class="space-y-3">
      <!-- Flashcard practice -->
      <button
        class="w-full rounded-2xl bg-(--color-card) border border-(--color-border) shadow-sm p-4 text-left transition-transform active:scale-95"
        @click="router.push('/kana/hiragana')"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">あ</span>
          <div>
            <div class="font-bold">平假名字卡</div>
            <div class="text-xs text-(--color-text-secondary)">
              已熟悉 {{ progress.kanaStats.mastered }} 個
            </div>
          </div>
        </div>
      </button>

      <button
        class="w-full rounded-2xl bg-(--color-card) border border-(--color-border) shadow-sm p-4 text-left transition-transform active:scale-95"
        @click="router.push('/kana/katakana')"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">ア</span>
          <div>
            <div class="font-bold">片假名字卡</div>
            <div class="text-xs text-(--color-text-secondary)">翻轉記憶練習</div>
          </div>
        </div>
      </button>

      <!-- Chart -->
      <button
        class="w-full rounded-2xl bg-(--color-card) border border-(--color-border) shadow-sm p-4 text-left transition-transform active:scale-95"
        @click="router.push('/kana/chart')"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">📊</span>
          <div>
            <div class="font-bold">五十音總覽表</div>
            <div class="text-xs text-(--color-text-secondary)">傳統行段排列，查看熟練度</div>
          </div>
        </div>
      </button>

      <!-- Quiz -->
      <button
        class="w-full rounded-2xl bg-(--color-card) border border-(--color-border) shadow-sm p-4 text-left transition-transform active:scale-95"
        @click="router.push('/kana/quiz')"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">🎯</span>
          <div>
            <div class="font-bold">隨機測驗</div>
            <div class="text-xs text-(--color-text-secondary)">20 題隨機出題，即時回饋</div>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>
