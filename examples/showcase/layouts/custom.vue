<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="custom">
    <slot name="header">
      <p>
        <i>Default #header slot content for <code>layouts/custom.vue</code></i>
      </p>
    </slot>
    <slot />
  </div>
</template>

<style scoped>
.custom {
  border: 1px solid #a795ec;
  padding: 1rem;
  position: relative;
  background-color: #a795ec87;
}
.custom::before {
  content: 'layouts/custom.vue';
  position: absolute;
  top: 2px;
  left: 5px;
  color: #583ccb;
  font-family: monospace;
}
</style>
