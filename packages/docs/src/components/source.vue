<script setup lang="ts">
interface SourceProps {
  name: string;
  type: string;
}

const props = defineProps<SourceProps>();

const repositoryLink = `https://github.com/siberiacancode/reactuse/blob/main/packages/core/src/${props.type}s/${props.name}`;

const sourceLink = `${repositoryLink}/${props.name}.ts`;
const demoLink = `${repositoryLink}/${props.name}.demo.tsx`;
</script>

<template>
  <a target="_blank" :href="sourceLink">Source</a> •
  <a target="_blank" :href="demoLink">Demo</a>
</template>
