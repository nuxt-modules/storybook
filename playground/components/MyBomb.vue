<script lang="ts" setup>
function explode() {
  throw new Error('Boom')
}
</script>

<template>
  <MyButton label="throw an error" size="small" @click="explode" />
</template>
