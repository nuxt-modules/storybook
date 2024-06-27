<script setup>
const reloads = useState('static', () => 0)

onMounted(() => {
  reloads.value++
})
definePageMeta({
  key: 'static',
})
</script>

<template>
  <div>Child reloaded: {{ reloads }}</div>
</template>
