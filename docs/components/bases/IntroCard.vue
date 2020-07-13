<template>
  <div class="p-6">
    <div class="flex">
      <img src="/nuxt-icon.png" width="45">
      <img src="/icon.png" width="45" class="ml-auto">
    </div>
    <div class="text-center my-16 text-xl">
      <div class="font-bold text-4xl">
        <span class="nuxt">@nuxtjs/</span><span class="storybook">storybook</span>
      </div>
      The Storybook module for Nuxtjs
    </div>
    <div class="flex">
      <img src="/icon.png" width="45">
      <img src="/nuxt-icon.png" width="45" class="ml-auto">
    </div>
  </div>
</template>

<script>
export default {
  props: []
}
</script>

<style scoped>
.nuxt {
  color: #3E8576;
}
.storybook {
  color: #ff4684
}
</style>
