<script lang="ts" setup>
const { count, increment } = useCounter()
</script>

<template>
  <div class="storybook">
    <p>count: {{ count }}</p>
    <MyButton label="increment" size="small" @click="increment" />
  </div>
</template>
