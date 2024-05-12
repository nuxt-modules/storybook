<script setup>
const router = useRouter()
const route = useRoute()
</script>

<template>
  <div class="overflow-visible" style="height: 56px;display: flex;gap: 10px;">
    <my-button @click="router.push(`/`)">
      <NuxtLink to="/" class="n-link-base">
        Home
      </NuxtLink>
    </my-button>
    <my-button @click="router.push(`/about`)">
      <NuxtLink to="/about" class="n-link-base">
        About
      </NuxtLink>
    </my-button>

    <my-button @click="router.push(`/parent`)">
      <NuxtLink to="/parent" class="n-link-base">
        Parent (index)
      </NuxtLink>
    </my-button>
    <my-button>
      <NuxtLink to="/parent/b" class="n-link-base">
        Parent (b)
      </NuxtLink>
    </my-button>
    <my-button class="n-link-base" @click="router.push(`/parent/reload-${(Math.random() * 100).toFixed()}`)">
      Keyed child
    </my-button>
    <my-button class="n-link-base" @click="router.push(`/parent/static-${(Math.random() * 100).toFixed()}`)">
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
