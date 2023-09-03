<script setup>
const reloads = useState('reload', () => 0)
// eslint-disable-next-line max-statements-per-line
onMounted(() => { reloads.value++ })
</script>

<template>
  <div>
    Child reloaded: {{ reloads }}
  </div>
</template>
