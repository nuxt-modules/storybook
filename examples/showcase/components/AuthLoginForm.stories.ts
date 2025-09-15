import type { Meta, StoryObj } from '@nuxtjs/storybook'
import AuthLoginForm from './AuthLoginForm.vue'

/**
 * The AuthLoginForm component demonstrates authentication functionality with @sidebase/nuxt-auth.
 * It provides a form for credential-based login and OAuth provider login (GitHub).
 */
const meta = {
  title: 'Modules/Auth/Login Form',
  component: AuthLoginForm,
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: 'boolean',
      description: 'Shows loading state during authentication'
    },
    error: {
      control: 'text',
      description: 'Error message to display'
    },
    onLogin: {
      action: 'login',
      description: 'Callback when user submits credentials'
    },
    onGithubLogin: {
      action: 'github-login',
      description: 'Callback when user clicks GitHub login'
    }
  }
} satisfies Meta<typeof AuthLoginForm>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default login form ready for user interaction
 */
export const Default: Story = {}

/**
 * Login form in loading state during authentication
 */
export const Loading: Story = {
  args: {
    loading: true
  }
}

/**
 * Login form displaying an error message
 */
export const WithError: Story = {
  args: {
    error: 'Invalid username or password. Please try again.'
  }
}

/**
 * Interactive example showing the complete login flow
 */
export const InteractiveDemo: Story = {
  args: {
    onLogin: (credentials: any) => {
      console.log('Login attempt with:', credentials)
      if (credentials.username === 'demo' && credentials.password === 'demo') {
        alert('✅ Login successful! (Demo mode)')
      } else if (credentials.username === 'admin' && credentials.password === 'admin') {
        alert('✅ Admin login successful! (Demo mode)')
      } else {
        alert('❌ Invalid credentials. Try demo/demo or admin/admin')
      }
    },
    onGithubLogin: () => {
      alert('🚀 Redirecting to GitHub OAuth... (Demo mode)')
    }
  }
}