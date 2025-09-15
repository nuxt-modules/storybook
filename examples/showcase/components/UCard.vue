<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    class?: string
  }>(),
  {
    class: '',
  },
)

const classes = computed(() => [
  'bg-white overflow-hidden shadow rounded-lg',
  props.class,
])
</script>

<template>
  <div :class="classes">
    <div
      v-if="$slots.header"
      class="px-4 py-5 sm:px-6 border-b border-gray-200"
    >
      <slot name="header" />
    </div>

    <div class="px-4 py-5 sm:p-6">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
/* Basic utility classes for UCard */
.bg-white {
  background-color: #ffffff;
}
.bg-gray-50 {
  background-color: #f9fafb;
}
.overflow-hidden {
  overflow: hidden;
}
.shadow {
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
}
.rounded-lg {
  border-radius: 0.5rem;
}
.border-b {
  border-bottom-width: 1px;
}
.border-t {
  border-top-width: 1px;
}
.border-gray-200 {
  border-color: #e5e7eb;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.py-5 {
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
}
.sm\:px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.sm\:p-6 {
  padding: 1.5rem;
}

@media (min-width: 640px) {
  .sm\:px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  .sm\:p-6 {
    padding: 1.5rem;
  }
}
</style>
