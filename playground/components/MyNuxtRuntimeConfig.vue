<script lang="ts" setup>
const config = useRuntimeConfig()
</script>

<template>
  <dl class="storybook">
    <dt>apiBase</dt>
    <dd data-testid="api-base">{{ config.public.apiBase }}</dd>
    <dt>baseURL</dt>
    <dd data-testid="base-url">{{ config.app.baseURL }}</dd>
  </dl>
</template>
