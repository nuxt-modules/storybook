<script lang="ts" setup>
import './button.css'

const route = useRoute()
</script>

<template>
  <div class="storybook welcome">
    <p>route: {{ route.fullPath }}</p>
    <NuxtLink class="storybook-button storybook-button--small" to="/about">
      internal link
    </NuxtLink>
    <a
      class="storybook-button storybook-button--small"
      href="https://nuxt.com/docs"
    >
      external link
    </a>
  </div>
</template>
