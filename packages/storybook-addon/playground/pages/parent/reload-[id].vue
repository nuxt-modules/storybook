<script setup>
const reloads = useState('reload', () => 0)

onMounted(() => {
  reloads.value++
})
</script>

<template>
  <div>Child reloaded: {{ reloads }}</div>
</template>
