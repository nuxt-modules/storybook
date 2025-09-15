<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    variant?: 'solid' | 'outline' | 'subtle' | 'ghost'
    color?: 'primary' | 'gray' | 'green' | 'red' | 'yellow'
    size?: 'xs' | 'sm' | 'md' | 'lg'
  }>(),
  {
    variant: 'solid',
    color: 'primary',
    size: 'md',
  },
)

const baseClasses = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-1 text-sm',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base',
}

const colorClasses = {
  solid: {
    primary: 'bg-blue-600 text-white',
    gray: 'bg-gray-600 text-white',
    green: 'bg-green-600 text-white',
    red: 'bg-red-600 text-white',
    yellow: 'bg-yellow-500 text-white',
  },
  outline: {
    primary: 'border border-blue-600 text-blue-600 bg-transparent',
    gray: 'border border-gray-600 text-gray-600 bg-transparent',
    green: 'border border-green-600 text-green-600 bg-transparent',
    red: 'border border-red-600 text-red-600 bg-transparent',
    yellow: 'border border-yellow-500 text-yellow-500 bg-transparent',
  },
  subtle: {
    primary: 'bg-blue-50 text-blue-700',
    gray: 'bg-gray-50 text-gray-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700',
  },
  ghost: {
    primary: 'text-blue-600 hover:bg-blue-50',
    gray: 'text-gray-600 hover:bg-gray-50',
    green: 'text-green-600 hover:bg-green-50',
    red: 'text-red-600 hover:bg-red-50',
    yellow: 'text-yellow-500 hover:bg-yellow-50',
  },
}

const classes = computed(() => [
  'inline-flex items-center rounded-full font-medium',
  baseClasses[props.size],
  colorClasses[props.variant][props.color],
])
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>

<style scoped>
/* Basic utility classes for UBadge */
.inline-flex {
  display: inline-flex;
}
.items-center {
  align-items: center;
}
.rounded-full {
  border-radius: 9999px;
}
.font-medium {
  font-weight: 500;
}
.bg-transparent {
  background-color: transparent;
}

.bg-blue-50 {
  background-color: #eff6ff;
}
.bg-gray-50 {
  background-color: #f9fafb;
}
.bg-green-50 {
  background-color: #f0fdf4;
}
.bg-red-50 {
  background-color: #fef2f2;
}
.bg-yellow-50 {
  background-color: #fefce8;
}

.text-blue-700 {
  color: #1d4ed8;
}
.text-gray-700 {
  color: #374151;
}
.text-green-700 {
  color: #15803d;
}
.text-red-700 {
  color: #b91c1c;
}
.text-yellow-700 {
  color: #a16207;
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

.px-1\.5 {
  padding-left: 0.375rem;
  padding-right: 0.375rem;
}
.px-2\.5 {
  padding-left: 0.625rem;
  padding-right: 0.625rem;
}
.py-0\.5 {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}
.py-1\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}
</style>
