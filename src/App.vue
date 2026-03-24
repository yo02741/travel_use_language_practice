<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useThemeStore } from "@/stores/theme";

const router = useRouter();
const theme = useThemeStore();
const themeTransitioning = ref(false);

function goHome() {
  router.push("/");
}

function toggleTheme(e: MouseEvent) {
  const x = e.clientX;
  const y = e.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
  const goingDark = !theme.isDark;

  if (document.startViewTransition) {
    document.documentElement.style.setProperty("--vt-x", `${x}px`);
    document.documentElement.style.setProperty("--vt-y", `${y}px`);
    document.documentElement.style.setProperty("--vt-r", `${endRadius}px`);

    // Mark direction so CSS can pick the right animation
    document.documentElement.classList.toggle("vt-to-dark", goingDark);
    document.documentElement.classList.toggle("vt-to-light", !goingDark);

    const transition = document.startViewTransition(() => {
      theme.toggle();
    });

    transition.finished.then(() => {
      document.documentElement.classList.remove("vt-to-dark", "vt-to-light");
    });
  } else {
    theme.toggle();
  }
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
        @click="toggleTheme"
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

<style>
/* View Transition: circular reveal (bidirectional) */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

/* Light → Dark: new (dark) expands over old (light) */
.vt-to-dark::view-transition-new(root) {
  z-index: 999;
  clip-path: circle(0% at var(--vt-x, 50%) var(--vt-y, 50%));
  animation: vt-expand 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.vt-to-dark::view-transition-old(root) {
  z-index: 1;
}

/* Dark → Light: old (dark) shrinks to reveal new (light) */
.vt-to-light::view-transition-old(root) {
  z-index: 999;
  clip-path: circle(var(--vt-r, 100%) at var(--vt-x, 50%) var(--vt-y, 50%));
  animation: vt-shrink 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.vt-to-light::view-transition-new(root) {
  z-index: 1;
}

@keyframes vt-expand {
  to {
    clip-path: circle(var(--vt-r, 100%) at var(--vt-x, 50%) var(--vt-y, 50%));
  }
}

@keyframes vt-shrink {
  to {
    clip-path: circle(0% at var(--vt-x, 50%) var(--vt-y, 50%));
  }
}
</style>

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
