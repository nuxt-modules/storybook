<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    /** Route the button navigates to. */
    to?: string
  }>(),
  { to: '/about' },
)

const route = useRoute()
</script>

<template>
  <div class="storybook">
    <p>route: {{ route.fullPath }}</p>
    <MyButton
      :label="`navigateTo('${props.to}')`"
      size="small"
      @click="navigateTo(props.to)"
    />
  </div>
</template>
