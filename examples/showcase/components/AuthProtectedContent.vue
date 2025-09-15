<template>
  <div class="auth-protected-content">
    <div v-if="isAuthenticated" class="authenticated-content">
      <div class="header">
        <h2>🔒 Protected Content</h2>
        <p class="subtitle">This content is only visible to authenticated users</p>
      </div>
      
      <div class="content-sections">
        <div class="section">
          <h3>User Dashboard</h3>
          <p>Welcome back, {{ user?.name || 'User' }}! Here's your personalized dashboard.</p>
          
          <div class="dashboard-cards">
            <div class="card">
              <h4>🎯 My Tasks</h4>
              <p>5 pending tasks</p>
            </div>
            <div class="card">
              <h4>📊 Analytics</h4>
              <p>View your stats</p>
            </div>
            <div class="card">
              <h4>⚙️ Settings</h4>
              <p>Customize your experience</p>
            </div>
          </div>
        </div>
        
        <div v-if="hasAdminRole" class="section admin-section">
          <h3>👑 Admin Panel</h3>
          <p>Administrative functions - only visible to admin users</p>
          
          <div class="admin-actions">
            <button class="admin-btn">Manage Users</button>
            <button class="admin-btn">System Settings</button>
            <button class="admin-btn">Reports</button>
          </div>
        </div>
        
        <div class="section">
          <h3>📄 Private Documents</h3>
          <div class="document-list">
            <div class="document-item">
              <span class="doc-icon">📄</span>
              <span class="doc-name">Confidential Report.pdf</span>
              <button class="download-btn">Download</button>
            </div>
            <div class="document-item">
              <span class="doc-icon">📊</span>
              <span class="doc-name">Analytics Dashboard.xlsx</span>
              <button class="download-btn">Download</button>
            </div>
            <div class="document-item">
              <span class="doc-icon">🔑</span>
              <span class="doc-name">API Keys.txt</span>
              <button class="download-btn">Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="unauthenticated-content">
      <div class="lock-icon">🔒</div>
      <h2>Access Restricted</h2>
      <p>Please log in to view this protected content.</p>
      <button @click="handleLogin" class="login-prompt-btn">
        Sign In to Continue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  id?: string
  name?: string
  email?: string
  role?: string
}

interface Props {
  isAuthenticated?: boolean
  user?: User | null
  onLogin?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  isAuthenticated: false,
  user: null
})

const hasAdminRole = computed(() => {
  return props.user?.role === 'admin'
})

const handleLogin = () => {
  if (props.onLogin) {
    props.onLogin()
  }
}
</script>

<style scoped>
.auth-protected-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.authenticated-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #e5e7eb;
}

.header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
}

.content-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section {
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.section h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.section p {
  margin: 0 0 16px 0;
  color: #6b7280;
  line-height: 1.5;
}

.admin-section {
  border-color: #dc2626;
  background: #fef2f2;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  text-align: center;
}

.card h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.card p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.admin-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.admin-btn {
  padding: 10px 16px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.admin-btn:hover {
  background: #b91c1c;
}

.document-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.doc-icon {
  font-size: 20px;
}

.doc-name {
  flex: 1;
  font-weight: 500;
  color: #374151;
}

.download-btn {
  padding: 6px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.download-btn:hover {
  background: #2563eb;
}

.unauthenticated-content {
  text-align: center;
  padding: 64px 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.lock-icon {
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.5;
}

.unauthenticated-content h2 {
  margin: 0 0 16px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.unauthenticated-content p {
  margin: 0 0 24px 0;
  color: #6b7280;
  font-size: 16px;
}

.login-prompt-btn {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.login-prompt-btn:hover {
  background: #2563eb;
}
</style>