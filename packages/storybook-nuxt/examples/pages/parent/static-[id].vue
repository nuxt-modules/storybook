<script setup>
const reloads = useState('static', () => 0)
// eslint-disable-next-line max-statements-per-line
onMounted(() => { reloads.value++ })
definePageMeta({
  key: 'static',
})
</script>

<template>
  <div>
    Child reloaded: {{ reloads }}
  </div>
</template>
