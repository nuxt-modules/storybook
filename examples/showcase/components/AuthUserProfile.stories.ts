import type { Meta, StoryObj } from '@nuxtjs/storybook'
import AuthUserProfile from './AuthUserProfile.vue'

/**
 * The AuthUserProfile component displays user information and profile actions.
 * It demonstrates how to present authenticated user data in a clean, organized way.
 */
const meta = {
  title: 'Modules/Auth/User Profile',
  component: AuthUserProfile,
  tags: ['autodocs'],
  argTypes: {
    user: {
      control: 'object',
      description: 'User object containing profile information'
    },
    onEditProfile: {
      action: 'edit-profile',
      description: 'Callback when edit profile is clicked'
    },
    onLogout: {
      action: 'logout',
      description: 'Callback when logout is clicked'
    }
  }
} satisfies Meta<typeof AuthUserProfile>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Profile for a regular user with avatar image
 */
export const RegularUser: Story = {
  args: {
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      image: 'https://avatars.githubusercontent.com/u/1?v=4',
      provider: 'credentials'
    }
  }
}

/**
 * Profile for an admin user with special role badge
 */
export const AdminUser: Story = {
  args: {
    user: {
      id: '2',
      name: 'Jane Admin',
      email: 'jane.admin@example.com',
      image: 'https://avatars.githubusercontent.com/u/2?v=4',
      role: 'admin',
      provider: 'credentials'
    }
  }
}

/**
 * Profile without avatar image (shows initials fallback)
 */
export const WithoutAvatar: Story = {
  args: {
    user: {
      id: '3',
      name: 'Alex Smith',
      email: 'alex.smith@example.com',
      role: 'user',
      provider: 'github'
    }
  }
}

/**
 * Profile for GitHub OAuth user
 */
export const GitHubUser: Story = {
  args: {
    user: {
      id: '12345',
      name: 'GitHub Developer',
      email: 'developer@github.com',
      image: 'https://avatars.githubusercontent.com/u/12345?v=4',
      provider: 'github'
    }
  }
}

/**
 * Interactive demo with working action buttons
 */
export const InteractiveDemo: Story = {
  args: {
    user: {
      id: '6',
      name: 'Interactive User',
      email: 'interactive@example.com',
      image: 'https://avatars.githubusercontent.com/u/6?v=4',
      role: 'admin',
      provider: 'github'
    },
    onEditProfile: () => {
      alert('🛠️ Edit Profile clicked! (Demo mode)')
    },
    onLogout: () => {
      if (confirm('Are you sure you want to sign out?')) {
        alert('👋 Logout successful! (Demo mode)')
      }
    }
  }
}