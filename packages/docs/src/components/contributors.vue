<script setup lang="ts">
const props = defineProps<{
  contributors: { name: string; avatar: string; github: string }[];
}>();
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <div
      v-for="contributor in props.contributors"
      :key="contributor.name"
      class="flex items-center gap-2"
    >
      <img :src="contributor.avatar" alt="Avatar" class="size-6 rounded-full">
      <span class="text-sm">{{ contributor.name }}</span>
    </div>
  </div>
</template>
