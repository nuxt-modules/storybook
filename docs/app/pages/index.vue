<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
defineOgImage('OgImageDefaultTakumi')
const { data: page } = await useAsyncData('index', () =>
  queryCollection('landing').path('/').first(),
)
if (!page.value) {
  throw createError({
    fatal: true,
    statusCode: 404,
    statusMessage: 'Page not found',
  })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  description,
  ogDescription: description,
  ogTitle: title,
  title,
  titleTemplate: '',
})
</script>

<template>
  <div>
    <GradientBackground />
    <ContentRenderer v-if="page" :value="page" :prose="false" />
  </div>
</template>
