<script setup lang="ts">
const { seo } = useAppConfig()

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

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [{ href: '/favicon.ico', rel: 'icon' }],
  meta: [{ content: 'width=device-width, initial-scale=1', name: 'viewport' }],
})

useSeoMeta({
  ogSiteName: seo?.siteName,
  titleTemplate: `%s - ${seo?.siteName}`,
  twitterCard: 'summary_large_image',
})

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <AppHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch :files="files" :navigation="navigation" />
    </ClientOnly>
  </UApp>
</template>
