<script setup lang="ts">
import {
  CheckCircle,
  Globe,
  Origami,
  PocketKnife,
  RefreshCw,
  SquareMousePointer,
  Telescope,
  Timer,
  XCircle
} from 'lucide-vue-next';

const props = defineProps<{
  category: string;
  isTest: boolean;
}>();

const CATEGORIES = {
  ELEMENTS: {
    color: 'bg-blue-200 text-blue-800 opacity-80',
    component: SquareMousePointer
  },
  UTILITIES: {
    color: 'bg-yellow-200 text-yellow-800 opacity-80',
    component: PocketKnife
  },
  BROWSER: {
    color: 'bg-purple-200 text-purple-800 opacity-80',
    component: Globe
  },
  SENSORS: {
    color: 'bg-fuchsia-200 text-fuchsia-800 opacity-80',
    component: Telescope
  },
  LIFECYCLE: {
    color: 'bg-cyan-200 text-cyan-800 opacity-80',
    component: RefreshCw
  },
  TIME: {
    color: 'bg-teal-200 text-teal-800 opacity-80',
    component: Timer
  },
  HUMOR: {
    color: 'bg-pink-200 text-pink-800 opacity-80',
    component: Origami
  }
};

const testCoverageClass = `${
  props.isTest ? 'bg-green-200 text-green-800 opacity-80' : 'bg-red-200 text-red-800 opacity-80'
}`;
</script>

<template>
  <div class="my-2 flex items-center gap-1">
    <div
      :class="`${
        CATEGORIES[props.category.toUpperCase()].color
      } flex items-center rounded-lg px-2 py-1 text-xs`"
    >
      <component :is="CATEGORIES[props.category.toUpperCase()].component" class="mr-1 size-3" />
      <span>{{ props.category.toLowerCase() }}</span>
    </div>

    <slot />

    <div :class="`${testCoverageClass} flex items-center rounded-lg px-2 py-1 text-xs`">
      <CheckCircle v-if="props.isTest" class="mr-1 size-3" />
      <XCircle v-else class="mr-1 size-3" />

      <span>test coverage</span>
    </div>
  </div>
</template>
