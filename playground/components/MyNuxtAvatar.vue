<script lang="ts" setup>
const props = defineProps<{ name: string }>()

const initials = computed(() =>
  props.name
    .split(' ')
    .map((part) => part[0])
    .join(''),
)
</script>

<template>
  <span class="storybook avatar">{{ initials }}</span>
</template>
