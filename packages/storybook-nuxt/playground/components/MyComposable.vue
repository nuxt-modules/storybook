<template>
    <h1> Using composables : </h1>
    <h5>runtime config :</h5>
    <pre>{{ JSON.stringify( config , null,2 ) }}</pre>

</template>
<script setup lang="ts">
 const { config } = useMyComposable()
</script>
