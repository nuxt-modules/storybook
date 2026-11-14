<script lang="ts" setup>
defineProps<{ amount: number; format: 'price' | 'total' }>()
</script>

<template>
  <p data-testid="formatted">
    {{ format === 'price' ? formatPrice(amount) : formatTotal(amount) }}
  </p>
</template>
