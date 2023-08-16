<template>
  <div style="display: flex;gap: 20px;padding: 20px;">
    <MyButton primary><NuxtLink to="/news">News</NuxtLink></MyButton>
    <MyButton primary><NuxtLink to="/about">About</NuxtLink></MyButton>
  </div>
  <div>
      <h1>Home</h1>
  </div>

  <pre>
  fullPath =  {{ $route.fullPath  }}
  path = {{ $route.path  }} 
  
  query {{ $route.query  }}
  </pre>
  
</template>
<script lang="ts" setup>

  import { useRouter , useRoute } from 'vue-router'
  const route = useRoute()  
  console.log(' Home route ',route)

  watchEffect(() => {
    console.log('watch route ',route)
  })
  // console.log(route)
 
</script>

```