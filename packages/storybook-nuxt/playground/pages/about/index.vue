<template>
    <div>
        <h1>About</h1>
        <p>{{ msg }}</p>
    </div>

    <pre>
        fullPath =  {{   $route.fullPath  }}
        path = {{ $route.path  }} 
        query {{ $route.query  }}
        </pre>
   <NuxtLink to="/">Home</NuxtLink>
    
</template>
<script lang="ts" setup>

   

    import {  useRouter , useRoute } from 'vue-router'

    const router = useRouter()
    const route = useRoute()
    console.log({ router, route})

   
</script>
```