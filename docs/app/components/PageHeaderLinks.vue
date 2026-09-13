<script setup lang="ts">
import { useClipboard } from '@vueuse/core'

const route = useRoute()
const toast = useToast()
const { copy, copied } = useClipboard()
const site = useSiteConfig()

const mdPath = computed(() => `${site.url}/raw${route.path}.md`)

const items = [
  {
    icon: 'i-lucide-link',
    label: 'Copy Markdown link',
    onSelect() {
      copy(mdPath.value)
      toast.add({
        icon: 'i-lucide-check-circle',
        title: 'Copied to clipboard',
      })
    },
  },
  {
    icon: 'i-simple-icons:markdown',
    label: 'View as Markdown',
    target: '_blank',
    to: `/raw${route.path}.md`,
  },
  {
    icon: 'i-simple-icons:openai',
    label: 'Open in ChatGPT',
    target: '_blank',
    to: `https://chatgpt.com/?hints=search&q=${encodeURIComponent(`Read ${mdPath.value} so I can ask questions about it.`)}`,
  },
  {
    icon: 'i-simple-icons:anthropic',
    label: 'Open in Claude',
    target: '_blank',
    to: `https://claude.ai/new?q=${encodeURIComponent(`Read ${mdPath.value} so I can ask questions about it.`)}`,
  },
]

async function copyPage() {
  copy(await $fetch<string>(`/raw${route.path}.md`))
}
</script>

<template>
  <UFieldGroup>
    <UButton
      label="Copy page"
      :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
      color="neutral"
      variant="outline"
      :ui="{
        leadingIcon: [copied ? 'text-primary' : 'text-neutral', 'size-3.5'],
      }"
      @click="copyPage"
    />
    <UDropdownMenu
      :items="items"
      :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 8,
      }"
      :ui="{
        content: 'w-48',
      }"
    >
      <UButton
        icon="i-lucide-chevron-down"
        size="sm"
        color="neutral"
        variant="outline"
        aria-label="Open copy actions menu"
      />
    </UDropdownMenu>
  </UFieldGroup>
</template>
