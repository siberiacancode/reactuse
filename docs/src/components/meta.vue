<script setup>
const props = defineProps({
  lastModified: {
    type: Number
  },
  category: {
    type: String
  }
});

const timeAgo = (timestamp, locale = 'en') => {
  let value;
  const diff = Math.floor((new Date().getTime() - timestamp) / 1000);
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (years > 0) {
    value = rtf.format(0 - years, "year");
  } else if (months > 0) {
    value = rtf.format(0 - months, "month");
  } else if (days > 0) {
    value = rtf.format(0 - days, "day");
  } else if (hours > 0) {
    value = rtf.format(0 - hours, "hour");
  } else if (minutes > 0) {
    value = rtf.format(0 - minutes, "minute");
  } else {
    value = rtf.format(0 - diff, "second");
  }
  return value;
}
</script>

<template>
  <div class="meta">
    <template v-if="category">
      <div>Category</div>
      <div><code>{{ category }}</code></div>
    </template>
    <ClientOnly v-if="lastModified">
      <div>Last Changed</div>
      <div>{{ timeAgo(lastModified) }}</div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.meta {
  font-size: .875rem;
  line-height: 1.25rem;
  display: grid;
  grid-template-columns: 100px auto;
  gap: .5rem;
  align-items: flex-start;
  margin-top: 1rem;
  margin-bottom: 2rem;
}
</style>
