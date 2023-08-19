<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
// console.log({ router, route })
</script>

<template>
  <div style="display: flex;gap: 20px;padding: 20px;">
    <NuxtLink to="/">
      <MyButton>Home</MyButton>
    </NuxtLink>
  </div>
  <div>
    <h1>About</h1>
  </div>

  <pre>
    fullPath =  {{ $route.fullPath }} ;
        path = {{ $route.path }} ;
       query = {{ $route.query }} ;
    </pre>
</template>
```
