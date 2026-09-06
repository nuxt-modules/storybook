<script lang="ts" setup>
import '~/assets/button.css'
import { computed } from 'vue'

type Sizes = 'small' | 'medium' | 'large' | 'xlarge'

const props = withDefaults(
  defineProps<{
    /**
     * The label of the button
     */
    label?: string
    /**
     * Primary or secondary button
     */
    primary?: boolean
    /**
     * Size of the button
     */
    size?: Sizes
    /**
     * Background color of the button
     */
    backgroundColor?: string
  }>(),
  {
    backgroundColor: undefined,
    label: '',
    primary: false,
    size: undefined,
  },
)

const emit = defineEmits<{
  (e: 'click', id: number): void
}>()

const classes = computed(() => ({
  'storybook-button': true,
  'storybook-button--primary': props.primary,
  'storybook-button--secondary': !props.primary,
  [`storybook-button--${props.size || 'medium'}`]: true,
}))

const style = computed(() => ({
  backgroundColor: props.backgroundColor,
}))

function onClick() {
  emit('click', 1)
}
</script>

<template>
  <div class="storybook sb-column">
    <button :class="classes" :style="style" @click="onClick">
      {{ label }} <slot />
    </button>
  </div>
</template>
