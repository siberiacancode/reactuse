<script setup lang="ts">
interface Contributor {
  avatar: string;
  github: string;
  name: string;
}

interface ContributorsProps {
  items: Contributor[];
}

const props = defineProps<ContributorsProps>();
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <div v-for="contributor in props.items" :key="contributor.name" class="flex items-center gap-2">
      <div class="relative size-6">
        <div
          class="absolute inset-0 z-[-1] flex items-center justify-center rounded-full bg-gray-200 text-sm font-medium dark:bg-gray-700"
        >
          {{ contributor.name.charAt(0).toUpperCase() }}
        </div>
        <img
          :src="contributor.avatar"
          :alt="contributor.name"
          class="rounded-full"
          loading="lazy"
        >
      </div>
      <span class="text-sm">{{ contributor.name }}</span>
    </div>
  </div>
</template>
