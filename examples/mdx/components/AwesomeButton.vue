<template>
  <button :style="{backgroundColor: '#' + color}">
    {{ label }}
  </button>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '000000'
    }
  }

}
</script>
