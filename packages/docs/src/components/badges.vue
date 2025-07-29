<script setup lang="ts">
import {
  CheckCircle,
  BoxIcon,
  GlobeIcon,
  HelpCircleIcon,
  OrigamiIcon,
  PocketKnifeIcon,
  RefreshCwIcon,
  SquareMousePointerIcon,
  TelescopeIcon,
  TimerIcon,
  XCircle,
  BugIcon,
  UserIcon,
  LoaderIcon,
} from "lucide-vue-next";

interface BadgesProps {
  category: string;
  isTest: boolean;
}

const props = defineProps<BadgesProps>();

const CATEGORIES = {
  ASYNC: {
    color: "bg-yellow-200 text-yellow-800 opacity-80",
    component: LoaderIcon,
  },
  STATE: {
    color: "bg-blue-200 text-blue-800 opacity-80",
    component: BoxIcon,
  },
  DEBUG: {
    color: "bg-red-200 text-red-800 opacity-80",
    component: BugIcon,
  },
  USER: {
    color: "bg-amber-200 text-amber-800 opacity-80",
    component: UserIcon,
  },
  ELEMENTS: {
    color: "bg-blue-200 text-blue-800 opacity-80",
    component: SquareMousePointerIcon,
  },
  UTILITIES: {
    color: "bg-yellow-200 text-yellow-800 opacity-80",
    component: PocketKnifeIcon,
  },
  BROWSER: {
    color: "bg-purple-200 text-purple-800 opacity-80",
    component: GlobeIcon,
  },
  SENSORS: {
    color: "bg-fuchsia-200 text-fuchsia-800 opacity-80",
    component: TelescopeIcon,
  },
  LIFECYCLE: {
    color: "bg-cyan-200 text-cyan-800 opacity-80",
    component: RefreshCwIcon,
  },
  TIME: {
    color: "bg-teal-200 text-teal-800 opacity-80",
    component: TimerIcon,
  },
  HUMOR: {
    color: "bg-pink-200 text-pink-800 opacity-80",
    component: OrigamiIcon,
  },
  HELPERS: {
    color: "bg-orange-200 text-orange-800 opacity-80",
    component: HelpCircleIcon,
  },
} as const;
</script>

<template>
  <div class="my-2 flex items-center gap-1">
    <div
      :class="`${
        CATEGORIES[props.category.toUpperCase() as keyof typeof CATEGORIES].color
      } flex items-center rounded-lg px-2 py-1 text-xs`"
    >
      <component
        :is="CATEGORIES[props.category.toUpperCase() as keyof typeof CATEGORIES].component"
        class="mr-1 size-3"
      />
      <span>{{ props.category.toLowerCase() }}</span>
    </div>

    <slot />

    <div
      :class="`${
        props.isTest
          ? 'bg-green-200 text-green-800 opacity-80'
          : 'bg-red-200 text-red-800 opacity-80'
      } flex items-center rounded-lg px-2 py-1 text-xs`"
    >
      <CheckCircle v-if="props.isTest" class="mr-1 size-3" />
      <XCircle v-else class="mr-1 size-3" />

      <span>test coverage</span>
    </div>
  </div>
</template>
