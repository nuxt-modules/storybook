<template>
  <button :style="{backgroundColor: color}">
    {{ label }}
  </button>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: 'Awesome Button'
    },
    color: {
      type: String,
      default: '#f0f0f0'
    }
  }

}
</script>

<style scoped>
button {
  border: none;
  padding: 10px;
}
</style>