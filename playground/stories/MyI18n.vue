<script lang="ts" setup>
import './button.css'
import type { Locale } from 'vue-i18n'

const props = defineProps<{
  lang: Locale
  message?: string
}>()

const { t, locale, setLocale } = useI18n()
const rtl = computed(() => locale.value === 'ar')

setLocale(props.lang)
watch(
  () => props.lang,
  async (lang) => {
    await setLocale(lang)
  },
)
</script>

<template>
  <div class="storybook lang-selector">
    <button class="storybook-button storybook-button--small" @click="setLocale('en')">en</button>
    <button class="storybook-button storybook-button--small" @click="setLocale('fr')">fr</button>
    <button class="storybook-button storybook-button--small" @click="setLocale('ar')">ar</button>
  </div>
  <div class="storybook welcome" :style="{ direction: rtl ? 'rtl' : 'ltr' }">
    <div>{{ t('welcome', { name: 'Storybook' }) }}</div>
    <div>{{ t('welcome', { name: 'Nuxt' }) }}</div>
    <div>{{ t('welcome', { name: 'I18n' }) }}</div>
  </div>

  <p>language : {{ locale }}</p>
</template>
