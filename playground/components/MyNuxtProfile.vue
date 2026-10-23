<script lang="ts" setup>
defineProps<{ name: string }>()
</script>

<template>
  <article class="storybook profile">
    <MyNuxtAvatar :name />
    <strong>{{ name }}</strong>
  </article>
</template>
