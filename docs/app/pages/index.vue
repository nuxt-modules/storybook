<script setup lang="ts">
const { data: page } = await useAsyncData('index', () =>
  queryCollection('landing').path('/').first(),
)
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  })
}

useSeoMeta({
  title: page.value.seo.title,
  titleTemplate: null,
  ogTitle: page.value.seo.title,
  description: page.value.seo.description,
  ogDescription: page.value.seo.description,
})
</script>

<template>
  <div>
    <GradientBackground />
    <ContentRenderer v-if="page" :value="page" :prose="false" />
  </div>
</template>
