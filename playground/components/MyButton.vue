<script lang="ts" setup>
import './button.css'

const props = withDefaults(
  defineProps<{
    /** Text shown in the button. */
    label: string
    /** Renders the button as the main call to action. */
    primary?: boolean
    /** How large the button is. */
    size?: 'small' | 'medium' | 'large'
  }>(),
  { primary: false, size: 'medium' },
)

defineEmits<{
  /** Fired when the button is clicked. */
  click: [event: MouseEvent]
}>()

const classes = computed(() => [
  'storybook-button',
  `storybook-button--${props.size}`,
  props.primary ? 'storybook-button--primary' : 'storybook-button--secondary',
])
</script>

<template>
  <button type="button" :class="classes" @click="$emit('click', $event)">
    <slot>{{ label }}</slot>
  </button>
</template>
