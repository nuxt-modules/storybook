<script lang="ts" setup>
import '../assets/button.css'

const props = defineProps<{
  lang: string
  message?: string
}>()
const { t, locale } = useI18n()
const rtl = computed(() => props.lang === 'ar')
locale.value = props.lang
watch(() => props.lang, (lang) => {
  locale.value = lang
})
</script>

<template>
  <div class="storybook lang-selector">
    <button class="storybook-button storybook-button--small" @click="locale = 'en'">
      en
    </button>
    <button class="storybook-button storybook-button--small" @click="locale = 'fr'">
      fr
    </button>
    <button class="storybook-button storybook-button--small" @click="locale = 'ar'">
      ar
    </button>
  </div>
  <div class="storybook welcome" :style="{ direction: rtl ? 'rtl' : 'ltr' }">
    <div> {{ t('welcome', { name: 'Storybook' }) }}</div>
    <div> {{ t('welcome', { name: 'Nuxt' }) }}</div>
    <div> {{ t('welcome', { name: 'I18n' }) }}</div>
  </div>

  <p> language : {{ lang }}</p>
</template>
