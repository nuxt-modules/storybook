<script lang="ts" setup>
defineProps<{ label: string }>()

// Only runs on the server: Storybook cannot render it without a mock
const renderedAt = new Date().toISOString()
</script>

<template>
  <p class="storybook">{{ label }}: {{ renderedAt }}</p>
</template>
