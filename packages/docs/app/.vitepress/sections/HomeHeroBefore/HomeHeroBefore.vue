<script setup lang="ts">
import HomeContainer from '../HomeContainer/HomeContainer.vue';
import { data } from './HomeHeroBefore.data';
</script>

<template>
  <HomeContainer
    class="mt-[37px]! -mb-24! hidden justify-center sm:-mb-[131px]! md:flex lg:justify-start"
  >
    <a
      href="/reactuse/introduction.html"
      class="flex items-center rounded-lg border-[var(--vp-c-brand-1)] bg-[var(--vp-c-bg-soft)] px-3 py-2 text-sm hover:bg-[var(--vp-c-bg-alt)]"
    >
      <span class="text-md font-medium">{{ data.count }} hooks ready to use</span>
    </a>
  </HomeContainer>
</template>
