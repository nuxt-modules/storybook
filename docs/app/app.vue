<script setup lang="ts">
const { seo } = useAppConfig()

const { data: navigation } = await useAsyncData('navigation', () =>
  queryCollectionNavigation('docs'),
)
const { data: files } = useLazyAsyncData(
  'search',
  () => queryCollectionSearchSections('docs'),
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
