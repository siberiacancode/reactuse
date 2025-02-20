<script setup>
const props = defineProps({
  hook: {
    type: String
  }
});

const repositoryLink = `https://github.com/siberiacancode/reactuse/tree/main/src/hooks/${props.hook}`;

const sourceLink = `${repositoryLink}/${props.hook}.ts`;
const demoLink = `${repositoryLink}/${props.hook}.demo.tsx`;
</script>

<template>
  <a target="_blank" :href="sourceLink">Source</a> • <a target="_blank" :href="demoLink">Demo</a>
</template>
