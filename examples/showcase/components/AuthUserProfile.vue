<template>
  <div class="auth-user-profile">
    <div class="profile-header">
      <div class="avatar">
        <img v-if="user?.image" :src="user.image" :alt="user.name || 'User'" />
        <div v-else class="avatar-placeholder">
          {{ getInitials(user?.name || 'User') }}
        </div>
      </div>
      
      <div class="user-info">
        <h2>{{ user?.name || 'Unknown User' }}</h2>
        <p v-if="user?.email" class="email">{{ user.email }}</p>
        <span v-if="user?.role" class="role-badge" :class="roleClass">
          {{ user.role }}
        </span>
      </div>
    </div>
    
    <div class="profile-details">
      <h3>Profile Information</h3>
      
      <div class="detail-row">
        <span class="label">User ID:</span>
        <span class="value">{{ user?.id || 'N/A' }}</span>
      </div>
      
      <div class="detail-row">
        <span class="label">Name:</span>
        <span class="value">{{ user?.name || 'N/A' }}</span>
      </div>
      
      <div class="detail-row">
        <span class="label">Email:</span>
        <span class="value">{{ user?.email || 'N/A' }}</span>
      </div>
      
      <div v-if="user?.role" class="detail-row">
        <span class="label">Role:</span>
        <span class="value">{{ user.role }}</span>
      </div>
      
      <div class="detail-row">
        <span class="label">Provider:</span>
        <span class="value">{{ user?.provider || 'credentials' }}</span>
      </div>
    </div>
    
    <div class="profile-actions">
      <button @click="handleEditProfile" class="edit-btn">
        Edit Profile
      </button>
      
      <button @click="handleLogout" class="logout-btn">
        Sign Out
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  id?: string
  name?: string
  email?: string
  image?: string
  role?: string
  provider?: string
}

interface Props {
  user?: User | null
  onEditProfile?: () => void
  onLogout?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  user: null
})

const roleClass = computed(() => {
  const role = props.user?.role?.toLowerCase()
  return {
    'role-admin': role === 'admin',
    'role-user': role === 'user' || !role,
    'role-moderator': role === 'moderator'
  }
})

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const handleEditProfile = () => {
  if (props.onEditProfile) {
    props.onEditProfile()
  }
}

const handleLogout = () => {
  if (props.onLogout) {
    props.onLogout()
  }
}
</script>

<style scoped>
.auth-user-profile {
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 20px;
  font-weight: 600;
  color: #6b7280;
}

.user-info h2 {
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.email {
  margin: 0 0 8px 0;
  color: #6b7280;
  font-size: 14px;
}

.role-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.role-badge.role-admin {
  background: #fee2e2;
  color: #dc2626;
}

.role-badge.role-user {
  background: #e0f2fe;
  color: #0277bd;
}

.role-badge.role-moderator {
  background: #f3e8ff;
  color: #7c3aed;
}

.profile-details {
  margin-bottom: 24px;
}

.profile-details h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.value {
  color: #6b7280;
  font-size: 14px;
}

.profile-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.edit-btn, .logout-btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.edit-btn {
  background: #3b82f6;
  color: white;
}

.edit-btn:hover {
  background: #2563eb;
}

.logout-btn {
  background: #ef4444;
  color: white;
}

.logout-btn:hover {
  background: #dc2626;
}
</style>