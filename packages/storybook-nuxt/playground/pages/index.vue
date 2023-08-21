<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// eslint-disable-next-line no-console
console.log({ route, router })
</script>

<template>
  <div style="display: flex;gap: 20px;padding: 20px;">
    <NuxtLink to="/news">
      <MyButton primary>
        News
      </MyButton>
    </NuxtLink>
    <NuxtLink to="/about">
      <MyButton primary>
        About
      </MyButton>
    </NuxtLink>
  </div>
  <div>
    <h1>Home</h1>
  </div>

  <pre>
  fullPath =  {{ $route.fullPath }}
  path = {{ $route.path }}

  query {{ $route.query }}
  </pre>
</template>

```
