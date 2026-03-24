<script setup lang="ts">
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme";

const router = useRouter();
const theme = useThemeStore();

function goHome() {
  router.push("/");
}
</script>

<template>
  <div class="min-h-dvh flex flex-col bg-(--color-bg)">
    <header
      class="sticky top-0 z-10 bg-(--color-bg)/80 backdrop-blur-sm border-b border-(--color-border) px-4 py-3 flex items-center justify-between"
    >
      <button class="flex items-center gap-2 text-lg font-bold tracking-wide" @click="goHome">
        <img src="/icons/icon-192.svg" alt="" class="w-7 h-7 rounded-lg" />
        旅語練習
      </button>
      <button
        class="w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-(--color-border)/50"
        :title="theme.isDark ? '切換亮色模式' : '切換深色模式'"
        @click="theme.toggle()"
      >
        {{ theme.isDark ? '☀️' : '🌙' }}
      </button>
    </header>

    <main class="flex-1 px-4 py-4 max-w-lg mx-auto w-full sm:px-6 md:py-6">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>
