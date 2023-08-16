<template>
    <div>
        <MyButton><NuxtLink to="/">Home</NuxtLink></MyButton>
        <h1>About</h1>
    </div>

    <pre>
    fullPath =  {{   $route.fullPath  }} ;
        path = {{ $route.path  }} ;
       query = {{ $route.query}} ;
    </pre>
   
    
</template>
<script lang="ts" setup>

   

    import {  useRouter , useRoute } from 'vue-router'

    const router = useRouter()
    const route = useRoute()
    console.log({ router, route})

   
</script>
```