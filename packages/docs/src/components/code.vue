<script setup lang="ts">
import { ChevronDown, ChevronUp } from 'lucide-vue-next';
import { ref } from 'vue';

interface CodeProps {
  lang: string;
  value: string;
}

const props = defineProps<CodeProps>();
const isExpanded = ref(false);

const shouldShowCollapse = props.value.split('\n').length > 20;
</script>

<template>
  <div :class="`language-${props.lang} vp-adaptive-theme vp-code`">
    <button title="Copy code" class="copy" />

    <span class="lang">{{ props.lang }}</span>

    <div
      class="h-fill relative overflow-hidden transition-[height] duration-300 ease-in-out"
      :class="{ 'h-[400px]': shouldShowCollapse && !isExpanded }"
    >
      <div v-html="props.value" />

      <div
        v-if="shouldShowCollapse && !isExpanded"
        class="absolute right-0 bottom-0 left-0 z-10 h-24 bg-gradient-to-t from-[var(--vp-code-block-bg)] to-transparent"
      />
    </div>

    <div v-if="shouldShowCollapse" class="mt-2 flex justify-center p-2">
      <button
        class="flex items-center hover:bg-gray-200 dark:hover:bg-gray-700"
        @click="isExpanded = !isExpanded"
      >
        <component :is="isExpanded ? ChevronUp : ChevronDown" class="size-4" />
      </button>
    </div>
  </div>
</template>
