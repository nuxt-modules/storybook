<script setup lang="ts">
const { config } = useMyComposable()
</script>

<template>
  <h1>Using composable</h1>
  <h5>runtime config :</h5>
  <pre>{{ config }}</pre>
</template>
