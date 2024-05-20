<script setup>
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';

const props = defineProps({
  hook: {
    type: String
  }
});

const sourceLink = computed(() => {
  return `https://github.com/siberiacancode/reactuse/blob/main/src/hooks/${props.hook}/${props.hook}.demo.tsx`;
});

const demoRef = ref();

onMounted(async () => {
  const demoComponent = await import(`../../../src/hooks/${props.hook}/${props.hook}.demo.tsx`);
  const root = createRoot(demoRef.value);
  root.render(createElement(demoComponent.default, {}, null));
});
</script>

<template>
  <div class="container">
    <p class="demo-link">
      <a :href="sourceLink" target="_blank">source</a>
    </p>
    <div ref="demoRef" />
  </div>
</template>

<style scoped>
.container {
  position: relative;
  background-color: var(--vp-code-block-bg);
  padding: 24px;
  position: relative;
  margin-bottom: 10px;
  border-radius: 8px;
}

.demo-link {
  position: absolute;
  top: 0;
  right: 10px;
  font-size: 12px;
  font-weight: 500;
  transition: color 0.5s;
  margin: 0.1rem 0;
}

:deep(p) {
  margin: 0.5rem 0;
}

:deep(button) {
  padding: 3px 15px;
  background-color: var(--vp-c-brand-2);
  color: #fff;
  margin: 0.5rem 0;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
  vertical-align: middle;
  transition: background-color 0.5s;
}

:deep(button:hover) {
  background-color: var(--vp-c-brand-3);
}

:deep(button ~ button) {
  margin-left: 0.5rem;
}

:deep(button[disabled], button.disabled) {
  cursor: not-allowed;
  background-color: var(--vp-c-brand-2);
  opacity: 0.8;
}

:deep(textarea) {
  display: block;
  min-width: 20rem;
  font-size: 1.05rem;
  padding: 0.5em 1em 0.4em 1em;
  border-radius: 4px;
  box-shadow: var(--vp-c-divider) 0 0 0 1px;
  margin: 0.5rem 0;
  outline: none;
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
  transition: background-color 0.5s;
}

:deet(textarea[readonly]) {
  background: var(--vp-c-bg-soft);
}

:deep(input) {
  display: block;
  font-size: 0.9rem;
  padding: 0.5em 1em 0.4em 1em;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  outline: none;
  background: var(--vp-c-bg);
  color: var(--vp-c-text);
  min-width: 20rem;
  margin: 0.5rem 0;
}

:deep(input:focus, button:focus) {
  border: 1px solid var(--vp-c-brand);
}
</style>
