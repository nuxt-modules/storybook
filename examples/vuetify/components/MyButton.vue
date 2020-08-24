<template>
  <v-btn depressed small :color="type"><slot /></v-btn>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'primary'
    }
  }
}
</script>
