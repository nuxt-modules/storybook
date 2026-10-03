<script lang="ts" setup>
import type { Locale } from 'vue-i18n'

const props = withDefaults(
  defineProps<{
    /** Locale the messages are rendered in. */
    lang?: Locale
  }>(),
  { lang: 'en' },
)

const { locale, locales, setLocale, t } = useI18n()

await setLocale(props.lang)
watch(() => props.lang, setLocale)
</script>

<template>
  <div class="storybook" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <MyButton
      v-for="{ code } in locales"
      :key="code"
      :label="code"
      :primary="code === locale"
      size="small"
      @click="setLocale(code)"
    />
    <p data-testid="message">{{ t('welcome', { name: 'Nuxt' }) }}</p>
    <p>language: {{ locale }}</p>
  </div>
</template>
