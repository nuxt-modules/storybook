import type { Meta, StoryObj } from '@nuxtjs/storybook'

import ContactPage from './contact.vue'
import DocsPage from './docs.vue'
import ExamplesPage from './examples.vue'
import HomePage from './index.vue'

const storySessionId = Math.random().toString(36).slice(2, 8)

type PageStoryArgs = {
  title: string
  description: string
  badge: string
  tone: 'blue' | 'green' | 'amber' | 'rose'
}

const meta = {
  title: 'Playground/Navigation/Pages',
  component: HomePage,
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    badge: { control: 'text' },
    tone: { control: 'select', options: ['blue', 'green', 'amber', 'rose'] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HomePage>

export default meta
type Story = StoryObj<typeof meta>

function renderPage(component: object) {
  return (args: PageStoryArgs) => ({
    components: { StoryPage: component },
    setup() {
      return { args, storySessionId }
    },
    template: `
      <div style="display:grid;gap:1rem;">
        <p style="margin:0;font:600 12px/1.4 monospace;">
          Story session: {{ storySessionId }}
        </p>
        <StoryPage v-bind="args" />
      </div>
    `,
  })
}

export const Home: Story = {
  args: {
    title: 'Nuxt Storybook Playground',
    description:
      'This playground now includes multiple routes so you can validate navigation behavior alongside stories.',
    badge: 'Home',
    tone: 'blue',
  },
  render: renderPage(HomePage),
}

export const Docs: Story = {
  args: {
    title: 'Documentation Route',
    description:
      'Use this route to verify docs-oriented layouts and links in the playground application.',
    badge: 'Docs',
    tone: 'green',
  },
  render: renderPage(DocsPage),
}

export const Examples: Story = {
  args: {
    title: 'Examples Route',
    description:
      'Route-specific pages make it easier to test Storybook components under navigation-driven flows.',
    badge: 'Examples',
    tone: 'amber',
  },
  render: renderPage(ExamplesPage),
}

export const Contact: Story = {
  args: {
    title: 'Contact Route',
    description:
      'This route can be used for testing forms and edge cases with client-side navigation.',
    badge: 'Contact',
    tone: 'rose',
  },
  render: renderPage(ContactPage),
}
