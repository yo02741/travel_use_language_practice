<script setup lang="ts">
import { SCENARIOS } from "@/types/scenario";
import { useProgressStore } from "@/stores/progress";
import { useRouter } from "vue-router";

const progress = useProgressStore();
const router = useRouter();

function goScenario(id: string) {
  router.push(`/scenario/${id}`);
}

function goKana() {
  router.push("/kana");
}

function resetAll() {
  if (confirm("確定要重置所有學習進度嗎？此操作無法復原。")) {
    progress.resetAll();
  }
}
</script>

<template>
  <div class="space-y-6">
    <section>
      <h2 class="text-lg font-bold mb-1">出發前，練一下 ✈️</h2>
      <p class="text-sm text-(--color-text-secondary) mb-4">
        選擇場景，開始旅遊日語＆英語練習
      </p>

      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="s in SCENARIOS"
          :key="s.id"
          class="rounded-2xl p-4 text-left transition-transform active:scale-95 bg-(--color-card) border border-(--color-border) shadow-sm"
          @click="goScenario(s.id)"
        >
          <div class="text-3xl mb-2">{{ s.icon }}</div>
          <div class="font-bold text-base mb-1">{{ s.name }}</div>
          <div class="text-xs text-(--color-text-secondary)">
            {{ progress.scenarioProgress(s.id, 30).completed }}/30 完成
          </div>
          <div class="mt-2 h-1.5 rounded-full bg-(--color-border) overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-300"
              :style="{
                width: progress.scenarioProgress(s.id, 30).percent + '%',
                backgroundColor: s.color,
              }"
            />
          </div>
        </button>
      </div>
    </section>

    <section>
      <button
        class="w-full rounded-2xl p-4 text-left bg-(--color-card) border border-(--color-border) shadow-sm transition-transform active:scale-95"
        @click="goKana"
      >
        <div class="flex items-center gap-3">
          <div class="text-3xl">あ</div>
          <div>
            <div class="font-bold text-base">五十音練習</div>
            <div class="text-xs text-(--color-text-secondary)">
              字卡記憶 · 總覽表 · 隨機測驗
            </div>
          </div>
        </div>
      </button>
    </section>

    <section class="text-center pt-2">
      <button
        class="text-xs text-(--color-text-secondary) underline"
        @click="resetAll"
      >重置全部進度</button>
    </section>
  </div>
</template>
