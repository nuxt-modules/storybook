<template>
  <div class="p-4">
    <div class="px-6 py-4">
      <span class="badge mr-2">#photography</span>
      <span class="badge mr-2">#travel</span>
      <span class="badge">#winter</span>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.badge {
  @apply inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700;
  &:hover {
    @apply bg-gray-300;
  }
}
</style>
