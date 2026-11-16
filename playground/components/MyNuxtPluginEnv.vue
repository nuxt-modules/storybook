<script lang="ts" setup>
const { $envDefault, $envNoStorybook } = useNuxtApp()
</script>

<template>
  <dl class="storybook">
    <dt>env-default</dt>
    <dd data-testid="env-default">{{ $envDefault ? 'ran' : 'skipped' }}</dd>
    <dt>env-no-storybook</dt>
    <dd data-testid="env-no-storybook">
      {{ $envNoStorybook ? 'ran' : 'skipped' }}
    </dd>
  </dl>
</template>
