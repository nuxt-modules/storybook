<template>
  <button :class="classObj">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    rounded: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classObj () {
      return {
        'btn-rounded': this.rounded
      }
    }
  }
}
</script>

<style scoped>
 button {
   padding: 10px;
 }

 .btn-rounded {
   border-radius: 20px;
 }
</style>
