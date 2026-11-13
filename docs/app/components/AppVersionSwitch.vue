<script setup lang="ts">
const route = useRoute()
const version = useDocsVersion()

const items = computed(() =>
  DOCS_VERSIONS.map((target) => ({
    icon: target === version.value ? 'i-lucide-check' : undefined,
    label: target.label,
    to: docsVersionPath(route.path, target),
  })),
)
</script>

<template>
  <UDropdownMenu :items="items" :content="{ align: 'start' }">
    <UButton
      :label="version.label"
      trailing-icon="i-lucide-chevron-down"
      color="neutral"
      variant="subtle"
      size="xs"
      aria-label="Documentation version"
    />
  </UDropdownMenu>
</template>
