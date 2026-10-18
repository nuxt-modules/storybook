<script lang="ts" setup>
const props = defineProps<{ name: string }>()

const greeting = computed(() => useGreeting(props.name))
</script>

<template>
  <p class="storybook">{{ greeting }}</p>
</template>
