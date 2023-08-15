<template>
  <div style="display: flex;gap: 20px;padding: 20px;">
    <MyButton primary><NuxtLink to="/news/iframe.html">News</NuxtLink></MyButton>
    <MyButton primary><NuxtLink to="/about">About</NuxtLink></MyButton>
    <MyButton primary><NuxtLink to="/pinia/iframe.html">Pinia</NuxtLink></MyButton>
  </div>
  <div>
      <h1>Home</h1>
  </div>

  <pre>
  fullPath =  {{   $route.fullPath  }}
  path = {{ $route.path  }} 
  
  query {{ $route.query  }}
  </pre>
  
</template>
<script lang="ts" setup>

  import { useRouter , useRoute } from 'vue-router'
  const route = useRoute()  
  console.log(route)
 
</script>

```