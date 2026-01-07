<template>
  <UPageHeader :title="$t('welcome')" />
  <div class="flex flex-row gap-3 my-6">
    <UButton
      v-for="locale in locales"
      :key="locale.name"
      variant="soft"
      @click="setLocale(locale.code)"
    >
      {{ locale.name }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
const { locales, setLocale } = useI18n()
</script>
