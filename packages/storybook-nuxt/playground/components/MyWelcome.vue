<template>
    <NuxtWelcome/>

    <h1> Using composables : </h1>
    <pre>
       - runtime config {{ JSON.stringify( config,null,2 ) }} -
    </pre>

</template>
<script setup lang="ts">
 const { config } = useMyComposable()
</script>
