<script setup>
const router = useRouter()
const route = useRoute()
</script>

<template>
  <div class="overflow-visible" style="height: 56px; display: flex; gap: 10px">
    <my-button @click="router.push(`/helloWorld`)">
      <NuxtLink to="/" class="n-link-base">Hello World</NuxtLink>
    </my-button>
    <my-button @click="router.push(`/router`)">
      <NuxtLink to="/router" class="n-link-base"> router (index) </NuxtLink>
    </my-button>
    <my-button>
      <NuxtLink to="/router/b" class="n-link-base"> router (b) </NuxtLink>
    </my-button>
    <my-button
      class="n-link-base"
      @click="router.push(`/router/reload-${(Math.random() * 100).toFixed()}`)"
    >
      Keyed child
    </my-button>
    <my-button
      class="n-link-base"
      @click="router.push(`/router/static-${(Math.random() * 100).toFixed()}`)"
    >
      Non-keyed child
    </my-button>
  </div>
  <div>
    <NuxtPage />
    <div class="text-center p-4 op-50">
      Current route: <code>{{ route.path }}</code>
    </div>
  </div>
</template>
