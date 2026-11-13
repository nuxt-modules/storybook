<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useHead({
  htmlAttrs: {
    lang: 'en',
  },
})

useSeoMeta({
  description: 'We are sorry but this page could not be found.',
  title: 'Page not found',
})

const version = useDocsVersion()
const { data: navigation } = await useAsyncData(
  () => `navigation-${version.value.collection}`,
  () => queryCollectionNavigation(version.value.collection),
  {
    transform: (items) => docsVersionNavigation(items, version.value),
  },
)
const { data: files } = useLazyAsyncData(
  () => `search-${version.value.collection}`,
  () => queryCollectionSearchSections(version.value.collection),
  {
    server: false,
  },
)

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <AppHeader />

    <UError :error="error" />

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch :files="files" :navigation="navigation" />
    </ClientOnly>
  </UApp>
</template>
