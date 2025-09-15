import type { Meta, StoryObj } from '@nuxtjs/storybook'
import AuthProtectedContent from './AuthProtectedContent.vue'

/**
 * The AuthProtectedContent component demonstrates conditional rendering based on authentication status.
 * It shows different content for authenticated vs unauthenticated users and demonstrates role-based access control.
 */
const meta = {
  title: 'Modules/Auth/Protected Content',
  component: AuthProtectedContent,
  tags: ['autodocs'],
  argTypes: {
    isAuthenticated: {
      control: 'boolean',
      description: 'Whether the user is authenticated'
    },
    user: {
      control: 'object',
      description: 'User object (required when authenticated)'
    },
    onLogin: {
      action: 'login-prompt',
      description: 'Callback when login prompt is clicked'
    }
  }
} satisfies Meta<typeof AuthProtectedContent>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Content shown to unauthenticated users with login prompt
 */
export const Unauthenticated: Story = {
  args: {
    isAuthenticated: false,
    user: null
  }
}

/**
 * Protected content for regular authenticated user
 */
export const AuthenticatedUser: Story = {
  args: {
    isAuthenticated: true,
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'user'
    }
  }
}

/**
 * Protected content with admin access - shows additional admin panel
 */
export const AdminUser: Story = {
  args: {
    isAuthenticated: true,
    user: {
      id: '2',
      name: 'Jane Admin',
      email: 'jane.admin@example.com',
      role: 'admin'
    }
  }
}

/**
 * Interactive demo with working login prompt
 */
export const InteractiveDemo: Story = {
  args: {
    isAuthenticated: false,
    user: null,
    onLogin: () => {
      alert('🔑 Redirecting to login page... (Demo mode)')
    }
  }
}