<script lang="ts" setup>
const {
  data: users,
  error,
  refresh,
  status,
} = await useFetch<string[]>('/api/users')

const name = ref('')

async function add() {
  await $fetch('/api/users', { body: { name: name.value }, method: 'POST' })
  name.value = ''
  await refresh()
}
</script>

<template>
  <div class="storybook">
    <p>status: {{ status }}</p>
    <p v-if="error" role="alert">{{ error.statusCode }} {{ error.message }}</p>
    <ul v-else>
      <li v-for="user in users" :key="user">{{ user }}</li>
    </ul>
    <form @submit.prevent="add">
      <input v-model="name" aria-label="name" placeholder="name" />
      <MyButton label="add" size="small" @click="add" />
    </form>
  </div>
</template>
