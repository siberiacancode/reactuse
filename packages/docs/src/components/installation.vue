<script setup lang="ts">
import { ref } from "vue";
import Code from "./code.vue";

import { cn } from "../utils";

const props = defineProps<{
  name: string;
}>();

const activeTab = ref<"library" | "cli">("library");

const libraryCode = `npm install @siberiacancode/reactuse`;
const cliCode = `npx useverse@latest add ${props.name}`;
</script>

<template>
  <div>
    <div class="flex gap-2 mb-4">
      <button
        @click="activeTab = 'library'"
        :class="
          cn(
            'px-2 py-1 text-xs rounded-lg',
            activeTab === 'library'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
          )
        "
      >
        Library
      </button>
      <button
        @click="activeTab = 'cli'"
        :class="
          cn(
            'px-2 py-1 text-xs rounded-lg',
            activeTab === 'cli'
              ? 'bg-blue-200 text-blue-800'
              : 'bg-gray-200 text-gray-600'
          )
        "
      >
        CLI
      </button>
    </div>

    <Code v-if="activeTab === 'library'" :code="libraryCode" lang="bash" />
    <Code v-else :code="cliCode" lang="bash" />
  </div>
</template>
