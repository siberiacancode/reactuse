<script setup lang="ts">
import { computed, ref } from 'vue';

import { data } from './HomeHooks.data';

const searchQuery = ref('');

const filteredHooks = computed(() =>
  data.hooks
    .map((hook) => {
      if (hook.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
        return {
          name: hook.name,
          disabled: false
        };

      return {
        name: hook.name,
        disabled: true
      };
    })
    .sort((a, b) => Number(a.disabled) - Number(b.disabled))
);
</script>

<template>
  <div class="mb-5 mt-12 text-center text-4xl font-bold">The hooks you need</div>
  <div class="py-4! px-2! relative h-[325px] overflow-hidden rounded-lg bg-[var(--vp-c-bg-soft)]">
    <div>
      <div
        class="flex w-fit items-center gap-3 rounded-lg bg-[var(--vp-c-default-soft)] p-2 px-4 text-2xl"
      >
        <svg
          class="stroke-[var(--vp-c-brand-1)]"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 22 22"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
        <input v-model="searchQuery" type="text" placeholder="search hook" />
      </div>
    </div>

    <div class="absolute left-2 top-20 flex w-[120%] flex-wrap justify-start gap-3">
      <div v-for="hook in filteredHooks.slice(0, 40)" :key="hook.name">
        <a
          :href="`/reactuse/functions/hooks/${hook.name}`"
          class="no-underline! text-[var(--vp-c-text-1)]! text-2xl"
        >
          <div
            class="hover:border-[var(--vp-c-brand-1)]/80 items-center rounded-lg border-[1px] border-transparent bg-[var(--vp-c-default-soft)] px-6 py-2 transition-all duration-300 hover:shadow-md"
            :class="{
              'opacity-50': hook.disabled
            }"
          >
            {{ hook.name }}
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
