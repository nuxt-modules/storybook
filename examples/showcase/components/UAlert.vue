<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    color?: 'primary' | 'gray' | 'green' | 'red' | 'yellow'
    variant?: 'solid' | 'outline' | 'subtle'
    icon?: string
  }>(),
  {
    title: '',
    description: '',
    color: 'primary',
    variant: 'subtle',
    icon: '',
  },
)

const colorClasses = {
  solid: {
    primary: 'bg-blue-600 text-white border-blue-600',
    gray: 'bg-gray-600 text-white border-gray-600',
    green: 'bg-green-600 text-white border-green-600',
    red: 'bg-red-600 text-white border-red-600',
    yellow: 'bg-yellow-500 text-white border-yellow-500',
  },
  outline: {
    primary: 'bg-white text-blue-700 border-blue-200',
    gray: 'bg-white text-gray-700 border-gray-200',
    green: 'bg-white text-green-700 border-green-200',
    red: 'bg-white text-red-700 border-red-200',
    yellow: 'bg-white text-yellow-700 border-yellow-200',
  },
  subtle: {
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
}

const classes = computed(() => [
  'rounded-md border p-4',
  colorClasses[props.variant][props.color],
])

const iconColorClasses = {
  primary: 'text-blue-600',
  gray: 'text-gray-600',
  green: 'text-green-600',
  red: 'text-red-600',
  yellow: 'text-yellow-600',
}

const iconClass = computed(() => [
  'mr-3 h-5 w-5',
  props.variant === 'solid' ? 'text-white' : iconColorClasses[props.color],
])
</script>

<template>
  <div :class="classes">
    <div class="flex">
      <div v-if="icon" class="flex-shrink-0">
        <div :class="iconClass">
          {{ icon }}
        </div>
      </div>
      <div>
        <h3 v-if="title" class="text-sm font-medium">
          {{ title }}
        </h3>
        <div v-if="description" class="mt-2 text-sm">
          {{ description }}
        </div>
        <div v-if="$slots.default" class="mt-2">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Basic utility classes for UAlert */
.rounded-md {
  border-radius: 0.375rem;
}
.border {
  border-width: 1px;
}
.p-4 {
  padding: 1rem;
}
.flex {
  display: flex;
}
.flex-shrink-0 {
  flex-shrink: 0;
}
.text-sm {
  font-size: 0.875rem;
}
.font-medium {
  font-weight: 500;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mr-3 {
  margin-right: 0.75rem;
}
.h-5 {
  height: 1.25rem;
}
.w-5 {
  width: 1.25rem;
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

.border-blue-200 {
  border-color: #bfdbfe;
}
.border-gray-200 {
  border-color: #e5e7eb;
}
.border-green-200 {
  border-color: #bbf7d0;
}
.border-red-200 {
  border-color: #fecaca;
}
.border-yellow-200 {
  border-color: #fef3c7;
}
</style>
