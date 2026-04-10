<script setup lang="ts">
const props = defineProps<{
  date: string | Date;
  class?: string;
  withDay?: boolean;
  withTime?: boolean;
}>();

const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  const day = d.getDate();
  const monthNames = [
    "januari",
    "februari",
    "maret",
    "april",
    "mei",
    "juni",
    "juli",
    "agustus",
    "september",
    "oktober",
    "november",
    "desember",
  ];
  const dayNames = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");

  let result = "";

  if (props.withDay) {
    result = `${dayNames[d.getDay()]}, ${day} ${month} ${year}`;
  } else {
    result = `${day} ${month} ${year}`;
  }

  if (props.withTime) {
    result += ` Jam ${hours}:${minutes}`;
  }

  return result;
};
</script>

<template>
  <span :class="class">{{ formatDate(props.date) }}</span>
</template>
