<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  code: String,
  lang: String
});

const container = ref(null);
onMounted(() => {
  if (container.value) {
    container.value.innerHTML += props.code;
  }
});
</script>

<template>
  <div ref="container" :class="`language-${props.lang} vp-adaptive-theme vp-code`">
    <button title="Copy code" class="copy" />
    <span class="lang">{{ props.lang }}</span>
  </div>
</template>
