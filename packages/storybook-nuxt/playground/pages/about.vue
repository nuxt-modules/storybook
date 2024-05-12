<script setup>
defineProps({
  msg: String,
})
</script>

<template>
  <div>
    About Storybook Nuxt Playground with Nuxt Image
  </div>
  <div>
    {{ msg }}
  </div>
  Nuxt Image
  <MyNuxtImage />
</template>
