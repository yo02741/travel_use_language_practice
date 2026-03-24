<script setup lang="ts">
import { ref } from "vue";
import type { VocabSlot } from "@/types/scenario";

const props = defineProps<{
  slots: VocabSlot[];
  selections: Record<string, number>; // label -> selected option index
}>();

const emit = defineEmits<{
  select: [label: string, index: number];
}>();

const expandedSlot = ref<string | null>(null);

function toggle(label: string) {
  expandedSlot.value = expandedSlot.value === label ? null : label;
}

function pick(label: string, index: number) {
  emit("select", label, index);
  expandedSlot.value = null;
}
</script>

<template>
  <div class="space-y-2">
    <div v-for="slot in props.slots" :key="slot.label" class="relative">
      <!-- Slot label + current selection -->
      <button
        class="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors"
        :class="
          expandedSlot === slot.label
            ? 'border-blue-300 bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700'
            : 'border-(--color-border) bg-(--color-card) text-(--color-text-secondary)'
        "
        @click="toggle(slot.label)"
      >
        <span class="font-medium">{{ slot.label }}</span>
        <span class="font-(--font-jp)">
          {{ slot.options[props.selections[slot.label] ?? 0]?.japanese }}
        </span>
        <span class="text-[10px]">{{
          expandedSlot === slot.label ? "▲" : "▼"
        }}</span>
      </button>

      <!-- Options dropdown (absolute overlay) -->
      <div
        v-if="expandedSlot === slot.label"
        class="absolute left-0 bottom-full mb-1.5 z-20 w-64 max-h-60 overflow-y-auto rounded-xl border border-(--color-border) bg-(--color-card) shadow-lg"
      >
        <button
          v-for="(opt, idx) in slot.options"
          :key="idx"
          class="w-full text-left px-3 py-2.5 border-b border-(--color-border) last:border-b-0 transition-colors"
          :class="
            (props.selections[slot.label] ?? 0) === idx
              ? 'bg-blue-50 dark:bg-blue-900/30'
              : 'hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-gray-700/30 dark:active:bg-gray-700/50'
          "
          @click="pick(slot.label, idx)"
        >
          <div class="flex items-center gap-2">
            <span
              v-if="(props.selections[slot.label] ?? 0) === idx"
              class="text-blue-500 dark:text-blue-400 text-xs"
              >✓</span
            >
            <div class="flex-1">
              <div class="flex items-baseline gap-2">
                <span
                  class="font-(--font-jp) font-medium text-(--color-text)"
                  >{{ opt.japanese }}</span
                >
                <span class="text-[11px] text-(--color-text-secondary)">{{
                  opt.romaji
                }}</span>
              </div>
              <div class="text-xs text-(--color-text-secondary)">
                {{ opt.english }} · {{ opt.chinese }}
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
