<script setup>
defineProps({
  msg: String,
})
</script>

<template>
  <div>
    Home Storybook
    Nuxt Image
    <MyNuxtImage />
  </div>
  <div>
    {{ msg }}
  </div>
</template>
