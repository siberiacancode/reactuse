<script setup>
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ref, onMounted, defineAsyncComponent } from 'vue';

const props = defineProps({
  hook: {
    type: String
  }
});

const demoRef = ref();

onMounted(async () => {
  const demoComponent = await import(`../../src/hooks/${props.hook}/${props.hook}.demo.tsx`);
  const root = createRoot(demoRef.value);
  root.render(createElement(demoComponent.default, {}, null));
});
</script>

<template>
  <div class="container">
    <div ref="demoRef" />
  </div>
</template>

<style scoped>
.container {
  border: 1px solid var(--vp-c-brand);
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

div:deep(button) {
  display: inline-block;
  outline: 0;
  cursor: pointer;
  padding: 5px 16px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  vertical-align: middle;
  border: 1px solid;
  border-radius: 6px;
  color: #24292e;
  background-color: #fafbfc;
  border-color: #1b1f2326;
  box-shadow:
    rgba(27, 31, 35, 0.04) 0px 1px 0px 0px,
    rgba(255, 255, 255, 0.25) 0px 1px 0px 0px inset;
  transition: 0.2s cubic-bezier(0.3, 0, 0.5, 1);
  transition-property: color, background-color, border-color;
}

div:deep(button:hover) {
  background-color: #f3f4f6;
  border-color: #1b1f2326;
  transition-duration: 0.1s;
}
</style>
