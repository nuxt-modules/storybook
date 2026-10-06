<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    /** Time the fake request takes, in milliseconds. */
    delay?: number
    /** Makes the fake request reject. */
    fail?: boolean
  }>(),
  { delay: 0, fail: false },
)

const { data, error, refresh, status } = await useAsyncData(
  'playground-users',
  async () => {
    await new Promise((resolve) => setTimeout(resolve, props.delay))
    if (props.fail) {
      throw new Error('Request failed')
    }
    return ['Ada', 'Grace', 'Linus']
  },
)
</script>

<template>
  <div class="storybook">
    <p>status: {{ status }}</p>
    <p v-if="error" role="alert">{{ error.message }}</p>
    <ul v-else>
      <li v-for="user in data" :key="user">{{ user }}</li>
    </ul>
    <MyButton label="refresh" size="small" @click="refresh()" />
  </div>
</template>
