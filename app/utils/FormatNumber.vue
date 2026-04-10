<script setup lang="ts">
defineProps<{
  value: number;
  digits?: number;
}>();
</script>

<template>
  <span>{{ value.toString().padStart(digits ?? 2, "0") }}</span>
</template>
