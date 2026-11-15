<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    /** Route or URL the button navigates to. */
    to?: string
    /** Navigates with `external: true`, leaving the app. */
    external?: boolean
    /** Opens the target in a new window instead. */
    open?: boolean
  }>(),
  { external: false, open: false, to: '/about' },
)

const route = useRoute()

function navigate() {
  return navigateTo(props.to, {
    external: props.external,
    open: props.open ? { target: '_blank' } : undefined,
  })
}
</script>

<template>
  <div class="storybook">
    <p>route: {{ route.fullPath }}</p>
    <MyButton
      :label="`navigateTo('${props.to}')`"
      size="small"
      @click="navigate"
    />
  </div>
</template>
