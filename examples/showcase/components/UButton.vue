<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    variant?: 'solid' | 'outline' | 'ghost' | 'link'
    color?: 'primary' | 'gray' | 'green' | 'red' | 'yellow'
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
    disabled?: boolean
  }>(),
  {
    variant: 'solid',
    color: 'primary',
    size: 'md',
    disabled: false,
  },
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const baseClasses = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
}

const colorClasses = {
  solid: {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    gray: 'bg-gray-600 text-white hover:bg-gray-700',
    green: 'bg-green-600 text-white hover:bg-green-700',
    red: 'bg-red-600 text-white hover:bg-red-700',
    yellow: 'bg-yellow-500 text-white hover:bg-yellow-600',
  },
  outline: {
    primary: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
    gray: 'border border-gray-600 text-gray-600 hover:bg-gray-50',
    green: 'border border-green-600 text-green-600 hover:bg-green-50',
    red: 'border border-red-600 text-red-600 hover:bg-red-50',
    yellow: 'border border-yellow-500 text-yellow-500 hover:bg-yellow-50',
  },
  ghost: {
    primary: 'text-blue-600 hover:bg-blue-50',
    gray: 'text-gray-600 hover:bg-gray-50',
    green: 'text-green-600 hover:bg-green-50',
    red: 'text-red-600 hover:bg-red-50',
    yellow: 'text-yellow-500 hover:bg-yellow-50',
  },
  link: {
    primary: 'text-blue-600 underline hover:text-blue-700',
    gray: 'text-gray-600 underline hover:text-gray-700',
    green: 'text-green-600 underline hover:text-green-700',
    red: 'text-red-600 underline hover:text-red-700',
    yellow: 'text-yellow-500 underline hover:text-yellow-600',
  },
}

const classes = computed(() => [
  'rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
  baseClasses[props.size],
  colorClasses[props.variant][props.color],
  props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
])

function onClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<template>
  <button :class="classes" :disabled="disabled" @click="onClick">
    <slot />
  </button>
</template>

<style scoped>
/* Basic utility classes for when Tailwind isn't available */
.bg-blue-600 {
  background-color: #2563eb;
}
.bg-blue-700 {
  background-color: #1d4ed8;
}
.bg-gray-600 {
  background-color: #4b5563;
}
.bg-gray-700 {
  background-color: #374151;
}
.bg-green-600 {
  background-color: #16a34a;
}
.bg-green-700 {
  background-color: #15803d;
}
.bg-red-600 {
  background-color: #dc2626;
}
.bg-red-700 {
  background-color: #b91c1c;
}
.bg-yellow-500 {
  background-color: #eab308;
}
.bg-yellow-600 {
  background-color: #ca8a04;
}

.text-white {
  color: #ffffff;
}
.text-blue-600 {
  color: #2563eb;
}
.text-gray-600 {
  color: #4b5563;
}
.text-green-600 {
  color: #16a34a;
}
.text-red-600 {
  color: #dc2626;
}
.text-yellow-500 {
  color: #eab308;
}

.border {
  border-width: 1px;
}
.border-blue-600 {
  border-color: #2563eb;
}
.border-gray-600 {
  border-color: #4b5563;
}
.border-green-600 {
  border-color: #16a34a;
}
.border-red-600 {
  border-color: #dc2626;
}
.border-yellow-500 {
  border-color: #eab308;
}

.hover\:bg-blue-700:hover {
  background-color: #1d4ed8;
}
.hover\:bg-gray-700:hover {
  background-color: #374151;
}
.hover\:bg-green-700:hover {
  background-color: #15803d;
}
.hover\:bg-red-700:hover {
  background-color: #b91c1c;
}
.hover\:bg-yellow-600:hover {
  background-color: #ca8a04;
}

.hover\:bg-blue-50:hover {
  background-color: #eff6ff;
}
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}
.hover\:bg-green-50:hover {
  background-color: #f0fdf4;
}
.hover\:bg-red-50:hover {
  background-color: #fef2f2;
}
.hover\:bg-yellow-50:hover {
  background-color: #fefce8;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.py-1\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.text-xs {
  font-size: 0.75rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-base {
  font-size: 1rem;
}
.text-lg {
  font-size: 1.125rem;
}
.text-xl {
  font-size: 1.25rem;
}

.rounded-md {
  border-radius: 0.375rem;
}
.font-medium {
  font-weight: 500;
}
.transition-colors {
  transition-property: color, background-color, border-color;
}
.duration-200 {
  transition-duration: 200ms;
}
.focus\:outline-none:focus {
  outline: none;
}
.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
.focus\:ring-offset-2:focus {
  box-shadow:
    0 0 0 2px #fff,
    0 0 0 4px rgba(59, 130, 246, 0.5);
}
.cursor-pointer {
  cursor: pointer;
}
.cursor-not-allowed {
  cursor: not-allowed;
}
.opacity-50 {
  opacity: 0.5;
}
.underline {
  text-decoration: underline;
}
</style>
