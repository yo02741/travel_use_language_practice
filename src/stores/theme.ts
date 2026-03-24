import { defineStore } from "pinia";
import { ref, watch } from "vue";

const STORAGE_KEY = "travel-lang-theme";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(loadTheme());

  function loadTheme(): boolean {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function toggle() {
    isDark.value = !isDark.value;
  }

  watch(
    isDark,
    (dark) => {
      document.documentElement.classList.toggle("dark", dark);
      localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
    },
    { immediate: true },
  );

  return { isDark, toggle };
});
