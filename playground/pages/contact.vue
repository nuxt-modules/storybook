<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    description?: string
    badge?: string
    tone?: 'blue' | 'green' | 'amber' | 'rose'
  }>(),
  {
    title: 'Contact Route',
    description:
      'This route can be used for testing forms and edge cases with client-side navigation.',
    badge: 'Contact',
    tone: 'rose',
  },
)
</script>

<template>
  <main class="page-shell" :data-tone="tone">
    <PlaygroundNav />
    <span class="page-badge">{{ badge }}</span>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </main>
</template>

<style scoped>
.page-shell {
  --page-accent: #e11d48;
  max-width: 48rem;
  margin: 2rem auto;
  padding: 0 1rem;
  display: grid;
  gap: 1rem;
}

.page-shell[data-tone='blue'] {
  --page-accent: #2563eb;
}

.page-shell[data-tone='green'] {
  --page-accent: #059669;
}

.page-shell[data-tone='amber'] {
  --page-accent: #d97706;
}

.page-badge {
  width: fit-content;
  padding: 0.35rem 0.7rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--page-accent) 14%, white);
  color: var(--page-accent);
  font-size: 0.875rem;
  font-weight: 700;
}
</style>
