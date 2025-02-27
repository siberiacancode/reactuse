<script setup lang="ts">
const props = defineProps<{
  lastModified: number;
  category: string;
}>();

const timeAgo = (timestamp: number, locale = 'en') => {
  let value;
  const diff = Math.floor((new Date().getTime() - timestamp) / 1000);
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (years > 0) {
    value = rtf.format(0 - years, 'year');
  } else if (months > 0) {
    value = rtf.format(0 - months, 'month');
  } else if (days > 0) {
    value = rtf.format(0 - days, 'day');
  } else if (hours > 0) {
    value = rtf.format(0 - hours, 'hour');
  } else if (minutes > 0) {
    value = rtf.format(0 - minutes, 'minute');
  } else {
    value = rtf.format(0 - diff, 'second');
  }
  return value;
};
</script>

<template>
  <div class="meta mt-4 mb-8 grid grid-cols-[100px_auto] gap-2 text-sm leading-6">
    <template v-if="props.category">
      <div class="font-semibold">Category</div>
      <div>
        <code class="text-blue-500">{{ props.category }}</code>
      </div>
    </template>
    <ClientOnly v-if="props.lastModified">
      <div class="font-semibold">Last Changed</div>
      <div>{{ timeAgo(props.lastModified) }}</div>
    </ClientOnly>
  </div>
</template>
