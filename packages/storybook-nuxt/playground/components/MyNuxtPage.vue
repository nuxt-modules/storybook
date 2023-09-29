<script setup>

</script>

<template>
  <v-container>
    <NuxtPage />
    <template #footer>
      <div class="text-center p-4 op-50">
        Current route: <code>{{ $route.path }}</code>
      </div>
    </template>
  </v-container>
  <v-layout class="overflow-visible" style="height: 56px;">
    <v-bottom-navigation
      v-model="value"
      active
      color="primary"
    >
      <v-btn>
        <v-icon>mdi-home</v-icon>

        <NuxtLink to="/" class="n-link-base">
          Home
        </NuxtLink>
      </v-btn>
      <v-btn>
        <v-icon>mdi-history</v-icon>

        <NuxtLink to="/about" class="n-link-base">
          About
        </NuxtLink>
      </v-btn>

      <v-btn>
        <v-icon>mdi-heart</v-icon>

        <NuxtLink to="/parent" class="n-link-base">
          Parent (index)
        </NuxtLink>
      </v-btn>

      <v-btn>
        <v-icon>mdi-map-marker</v-icon>

        <NuxtLink to="/parent/b" class="n-link-base">
          Parent (b)
        </NuxtLink>
      </v-btn>
      <v-btn class="n-link-base" @click="$router.push(`/parent/reload-${(Math.random() * 100).toFixed()}`)">
        Keyed child
      </v-btn>
      <v-btn class="n-link-base" @click="$router.push(`/parent/static-${(Math.random() * 100).toFixed()}`)">
        Non-keyed child
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
