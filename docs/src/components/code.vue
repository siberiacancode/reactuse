<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  code: String,
  lang: String
});
</script>

<template>
  <div :class="`language-${props.lang} vp-adaptive-theme vp-code`">
    <button title="Copy code" class="copy" />
    <span class="lang">{{ props.lang }}</span>
    <div v-html="props.code" />
  </div>
</template>
