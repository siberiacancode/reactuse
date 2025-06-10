<script setup lang="ts">
const props = defineProps<{
  code: string;
  lang: string;
}>();

const formattedCode = props.code.replace(/\n/g, "<br>");
</script>

<template>
  <div :class="`language-${props.lang} vp-adaptive-theme vp-code`">
    <button title="Copy code" class="copy" />
    <span class="lang">{{ props.lang }}</span>
    <div v-html="formattedCode" />
  </div>
</template>
