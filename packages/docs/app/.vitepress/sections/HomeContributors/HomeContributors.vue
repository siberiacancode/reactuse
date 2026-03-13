<script setup lang="ts">
import { ref } from 'vue';

import { data } from './HomeContributors.data';

interface Contributor {
  avatar: string;
  name: string;
}

const contributors = ref<Contributor[]>(data.contributors);
</script>

<template>
  <div class="mt-20">
    <div class="mb-10 text-center text-6xl font-bold">
      Team & Contributors
    </div>

    <div class="flex items-center justify-center">
      <a
        href="https://github.com/siberiacancode"
        target="_blank"
        class="flex items-center gap-2 text-[var(--vp-c-text-1)]! no-underline!"
      >
        <img
          src="https://avatars.githubusercontent.com/u/122668137?s=200&v=4"
          alt="SIBERIA CAN CODE"
          class="size-10 rounded-lg"
        >
        <div class="text-2xl font-bold">SIBERIA CAN CODE</div>
      </a>
    </div>

    <div class="mt-12 text-center">
      <div class="mt-6 flex flex-wrap justify-center gap-3">
        <div
          v-for="contributor in contributors"
          :key="contributor.name"
          :href="`https://github.com/${contributor.name}`"
          class="flex items-center gap-2"
        >
          <img
            :src="contributor.avatar"
            :alt="contributor.name"
            class="size-6 rounded-full"
            loading="lazy"
          >
          <div class="text-xs">
            {{ contributor.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
