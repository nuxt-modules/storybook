<template>
  <button @click="handleClick">Click me!</button>
</template>

<script setup lang="ts">
function handleClick() {
  alert('Button clicked!')
}
</script>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
