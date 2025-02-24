<script setup lang="ts">
const props = defineProps<{
  code: string;
  lang: string;
}>();
</script>

<template>
  <div :class="`language-${props.lang} vp-adaptive-theme vp-code`">
    <button title="Copy code" class="copy" />
    <span class="lang">{{ props.lang }}</span>
    <div v-html="props.code" />
  </div>
</template>
