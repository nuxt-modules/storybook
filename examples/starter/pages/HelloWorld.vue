<script setup>
import { ref } from 'vue'

const msg = ref('Hello World')

const { name } = defineProps({
  name: { type: String, default: 'Nuxt Developer' },
})
</script>

<template>
  <h1>{{ msg }} from {{ name }}</h1>
  <input v-model="msg" />
</template>

<style scoped>
h1 {
  color: blue;
}
</style>
