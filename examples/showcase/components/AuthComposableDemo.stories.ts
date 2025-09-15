import type { Meta, StoryObj } from '@nuxtjs/storybook'
import AuthComposableDemo from './AuthComposableDemo.vue'

/**
 * The AuthComposableDemo component demonstrates the @sidebase/nuxt-auth composables in action.
 * It shows authentication status, session data, and provides examples of using auth methods.
 */
const meta = {
  title: 'Modules/Auth/Composable Demo',
  component: AuthComposableDemo,
  tags: ['autodocs'],
  argTypes: {
    isAuthenticated: {
      control: 'boolean',
      description: 'Current authentication status'
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state during auth operations'
    },
    sessionStatus: {
      control: 'select',
      options: ['loading', 'authenticated', 'unauthenticated'],
      description: 'Current session status'
    },
    user: {
      control: 'object',
      description: 'Current user session data'
    },
    onCredentialsLogin: {
      action: 'credentials-login',
      description: 'Callback for credentials login'
    },
    onGithubLogin: {
      action: 'github-login',
      description: 'Callback for GitHub login'
    },
    onLogout: {
      action: 'logout',
      description: 'Callback for logout'
    }
  }
} satisfies Meta<typeof AuthComposableDemo>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Initial state - user not authenticated
 */
export const Unauthenticated: Story = {
  args: {
    isAuthenticated: false,
    isLoading: false,
    sessionStatus: 'unauthenticated',
    user: null
  }
}

/**
 * Loading state during authentication
 */
export const Loading: Story = {
  args: {
    isAuthenticated: false,
    isLoading: true,
    sessionStatus: 'loading',
    user: null
  }
}

/**
 * Authenticated state with regular user
 */
export const AuthenticatedUser: Story = {
  args: {
    isAuthenticated: true,
    isLoading: false,
    sessionStatus: 'authenticated',
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'user'
    }
  }
}

/**
 * Authenticated state with admin user
 */
export const AuthenticatedAdmin: Story = {
  args: {
    isAuthenticated: true,
    isLoading: false,
    sessionStatus: 'authenticated',
    user: {
      id: '2',
      name: 'Jane Admin',
      email: 'jane.admin@example.com',
      role: 'admin'
    }
  }
}

/**
 * Interactive demo with realistic auth flow
 */
export const InteractiveDemo: Story = {
  args: {
    isAuthenticated: false,
    isLoading: false,
    sessionStatus: 'unauthenticated',
    user: null,
    onCredentialsLogin: () => {
      alert('🔑 Simulating credentials login...\nIn real app: await signIn("credentials", { username, password })')
    },
    onGithubLogin: () => {
      alert('🐙 Simulating GitHub OAuth...\nIn real app: await signIn("github")')
    },
    onLogout: () => {
      if (confirm('Are you sure you want to sign out?')) {
        alert('👋 Simulating logout...\nIn real app: await signOut()')
      }
    }
  }
}