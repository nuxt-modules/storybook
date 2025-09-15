<script lang="ts" setup>
import UButton from './UButton.vue'
import UBadge from './UBadge.vue'
import UCard from './UCard.vue'
import UAlert from './UAlert.vue'

const _props = withDefaults(
  defineProps<{
    /**
     * The title for the showcase
     */
    title?: string
    /**
     * Description text
     */
    description?: string
    /**
     * Button variant
     */
    variant?: 'solid' | 'outline' | 'ghost' | 'link'
    /**
     * Button color
     */
    color?: 'primary' | 'gray' | 'green' | 'red' | 'yellow'
    /**
     * Button size
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  {
    title: 'Nuxt UI v4.0.0-alpha.1 Showcase',
    description:
      'A showcase of Nuxt UI v4.0.0-alpha.1 components (mocked for compatibility)',
    variant: 'solid',
    color: 'primary',
    size: 'md',
  },
)

const emit = defineEmits<{
  (e: 'button-click', id: string): void
}>()

function onButtonClick() {
  emit('button-click', 'showcase-button')
}
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="space-y-2">
      <h2 class="text-2xl font-bold">{{ _props.title }}</h2>
      <p class="text-gray-600">{{ _props.description }}</p>
    </div>

    <div class="space-y-4">
      <!-- Button showcase -->
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Button</h3>
        <UButton
          :variant="_props.variant"
          :color="_props.color"
          :size="_props.size"
          @click="onButtonClick"
        >
          Click me!
        </UButton>
      </div>

      <!-- Badge showcase -->
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Badge</h3>
        <UBadge :color="_props.color" :variant="_props.variant">
          Sample Badge
        </UBadge>
      </div>

      <!-- Card showcase -->
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Card</h3>
        <UCard class="max-w-md">
          <template #header>
            <h4 class="font-semibold">Card Header</h4>
          </template>

          <p>
            This is a sample card component from Nuxt UI v4.0.0-alpha.1 (mocked)
          </p>

          <template #footer>
            <div class="flex justify-end">
              <UButton size="sm" variant="outline"> Action </UButton>
            </div>
          </template>
        </UCard>
      </div>

      <!-- Alert showcase -->
      <div class="space-y-2">
        <h3 class="text-lg font-semibold">Alert</h3>
        <UAlert
          :color="_props.color"
          title="Nuxt UI Alert"
          description="This is a sample alert component."
          icon="ℹ️"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Basic utility classes */
.p-6 {
  padding: 1.5rem;
}
.space-y-6 > * + * {
  margin-top: 1.5rem;
}
.space-y-4 > * + * {
  margin-top: 1rem;
}
.space-y-2 > * + * {
  margin-top: 0.5rem;
}
.text-2xl {
  font-size: 1.5rem;
}
.text-lg {
  font-size: 1.125rem;
}
.font-bold {
  font-weight: 700;
}
.font-semibold {
  font-weight: 600;
}
.text-gray-600 {
  color: #4b5563;
}
.max-w-md {
  max-width: 28rem;
}
.flex {
  display: flex;
}
.justify-end {
  justify-content: flex-end;
}
</style>
