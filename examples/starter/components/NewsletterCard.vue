<script setup lang="ts">
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
  }>(),
  {
    title: 'Stay in the loop',
    description:
      'Get the latest Nuxt & Storybook news, straight to your inbox.',
  },
)

const emit = defineEmits<{
  subscribe: [email: string]
  dismiss: []
}>()

const email = ref('')
const status = ref<'idle' | 'error' | 'success'>('idle')

function onSubmit() {
  const value = email.value.trim()
  if (!EMAIL_PATTERN.test(value)) {
    status.value = 'error'
    return
  }
  status.value = 'success'
  emit('subscribe', value)
}
</script>

<template>
  <section class="newsletter" aria-labelledby="newsletter-title">
    <button
      type="button"
      class="newsletter__dismiss"
      aria-label="Dismiss"
      @click="emit('dismiss')"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </button>

    <h2 id="newsletter-title" class="newsletter__title">
      {{ props.title }}
    </h2>
    <p class="newsletter__description">
      {{ props.description }}
    </p>

    <p v-if="status === 'success'" class="newsletter__success" role="status">
      Thanks, you're subscribed!
    </p>
    <form v-else class="newsletter__form" novalidate @submit.prevent="onSubmit">
      <label for="newsletter-email" class="sr-only">Email address</label>
      <input
        id="newsletter-email"
        v-model="email"
        class="newsletter__input"
        type="email"
        placeholder="you@example.com"
        :aria-invalid="status === 'error'"
        aria-describedby="newsletter-error"
      />
      <button type="submit" class="newsletter__submit">Subscribe</button>
      <p
        v-if="status === 'error'"
        id="newsletter-error"
        class="newsletter__error"
        role="alert"
      >
        Please enter a valid email address.
      </p>
    </form>
  </section>
</template>

<style scoped>
.newsletter {
  position: relative;
  max-width: 420px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  color: #1e293b;
  font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.newsletter__dismiss {
  position: absolute;
  top: 12px;
  right: 12px;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #475569;
  cursor: pointer;
}

.newsletter__title {
  margin: 0 0 8px;
  font-size: 20px;
}

.newsletter__description {
  margin: 0 0 16px;
  color: #a0aec0;
  font-size: 14px;
  line-height: 1.5;
}

.newsletter__form {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.newsletter__input {
  flex: 1;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #94a3b8;
  border-radius: 8px;
  font-size: 14px;
}

.newsletter__submit {
  padding: 10px 18px;
  border: 0;
  border-radius: 8px;
  background: #34d399;
  color: #ffffff;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}

.newsletter__error {
  flex-basis: 100%;
  margin: 0;
  color: #b91c1c;
  font-size: 13px;
}

.newsletter__success {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: #ecfdf5;
  color: #065f46;
  font-weight: 600;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
