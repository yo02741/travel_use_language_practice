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
  <div class="min-h-dvh flex flex-col bg-decor">
    <header
      class="sticky top-0 z-10 glass border-b border-(--color-border) px-4 py-3 flex items-center justify-between"
    >
      <button
        class="flex items-center gap-2 text-lg font-bold tracking-wide cursor-pointer"
        @click="goHome"
      >
        <img src="/icons/icon-192.svg" alt="" class="w-7 h-7 rounded-lg" />
        旅語練習
      </button>
      <button
        class="theme-toggle w-9 h-9 flex items-center justify-center rounded-full transition-colors hover:bg-(--color-card-hover) cursor-pointer"
        :title="theme.isDark ? '切換亮色模式' : '切換深色模式'"
        @click="theme.toggle()"
      >
        <span class="theme-icon" :class="theme.isDark ? 'is-sun' : 'is-moon'">
          {{ theme.isDark ? "☀️" : "🌙" }}
        </span>
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

<style scoped>
/* Icon spin on toggle */
.theme-icon {
  display: inline-block;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-icon.is-sun {
  transform: rotate(0deg);
  animation: spin-in 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-icon.is-moon {
  transform: rotate(0deg);
  animation: spin-in 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes spin-in {
  from {
    transform: rotate(-180deg) scale(0.5);
    opacity: 0;
  }
  to {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}
</style>
