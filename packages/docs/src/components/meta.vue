<script setup lang="ts">
const props = defineProps<{
  lastModified: number;
}>();

const timeAgo = (timestamp: number, locale = "en") => {
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
};
</script>

<template>
  <div class="mb-10 text-xs">
    Last changed:
    <span class="font-bold">{{ timeAgo(props.lastModified) }}</span>
  </div>
</template>
