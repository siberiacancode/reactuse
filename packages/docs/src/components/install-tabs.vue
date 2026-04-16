<script setup lang="ts">
const model = defineModel<'cli' | 'library' | 'manual'>({
  required: true
});

const tabs = [
  { id: 'library', label: 'Library' },
  { id: 'cli', label: 'CLI' },
  { id: 'manual', label: 'Manual' }
] as const;
</script>

<template>
  <div class="mb-4 flex w-fit justify-start gap-2 rounded-lg">
    <div
      v-for="tab in tabs"
      :key="tab.id"
      class="flex cursor-pointer items-center rounded-lg px-2 py-1 text-sm"
      :class="{ 'bg-[var(--vp-code-block-bg)]': model === tab.id }"
      @click="model = tab.id"
    >
      {{ tab.label }}
    </div>
  </div>
</template>
