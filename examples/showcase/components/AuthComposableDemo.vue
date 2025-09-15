<template>
  <div class="auth-composable-demo">
    <h2>🧩 useAuth Composable Demo</h2>
    <p class="subtitle">Demonstrating @sidebase/nuxt-auth composables in action</p>
    
    <div class="demo-sections">
      <div class="section">
        <h3>Authentication Status</h3>
        <div class="status-grid">
          <div class="status-item">
            <span class="label">Authenticated:</span>
            <span class="value" :class="{ 'success': isAuthenticated, 'error': !isAuthenticated }">
              {{ isAuthenticated ? '✅ Yes' : '❌ No' }}
            </span>
          </div>
          
          <div class="status-item">
            <span class="label">Loading:</span>
            <span class="value" :class="{ 'warning': isLoading }">
              {{ isLoading ? '⏳ Loading...' : '✅ Ready' }}
            </span>
          </div>
          
          <div class="status-item">
            <span class="label">Session Status:</span>
            <span class="value" :class="statusClass">
              {{ sessionStatus }}
            </span>
          </div>
        </div>
      </div>
      
      <div v-if="user" class="section">
        <h3>Current Session Data</h3>
        <div class="json-display">
          <pre>{{ JSON.stringify(user, null, 2) }}</pre>
        </div>
      </div>
      
      <div class="section">
        <h3>Authentication Actions</h3>
        <div class="action-buttons">
          <button 
            v-if="!isAuthenticated"
            @click="handleCredentialsLogin"
            :disabled="isLoading"
            class="action-btn primary"
          >
            Sign in with Credentials
          </button>
          
          <button 
            v-if="!isAuthenticated"
            @click="handleGithubLogin"
            :disabled="isLoading"
            class="action-btn github"
          >
            Sign in with GitHub
          </button>
          
          <button 
            v-if="isAuthenticated"
            @click="handleLogout"
            :disabled="isLoading"
            class="action-btn danger"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      <div class="section">
        <h3>Composable Methods</h3>
        <div class="method-list">
          <div class="method-item">
            <strong>signIn():</strong> Authenticate with credentials or OAuth providers
          </div>
          <div class="method-item">
            <strong>signOut():</strong> End the current session
          </div>
          <div class="method-item">
            <strong>data:</strong> Reactive session data (user info, tokens, etc.)
          </div>
          <div class="method-item">
            <strong>status:</strong> Current authentication status ('loading', 'authenticated', 'unauthenticated')
          </div>
          <div class="method-item">
            <strong>getSession():</strong> Manually refresh session data
          </div>
        </div>
      </div>
      
      <div class="section code-section">
        <h3>💻 Code Example</h3>
        <div class="code-display">
          <pre><code>// In your Vue component
const { signIn, signOut, data, status } = useAuth()

// Sign in with credentials
await signIn('credentials', {
  username: 'demo',
  password: 'demo'
})

// Sign in with GitHub
await signIn('github')

// Sign out
await signOut()

// Access user data
const user = data.value
const isAuthenticated = status.value === 'authenticated'</code></pre>
        </div>
      </div>
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
  isLoading?: boolean
  user?: User | null
  sessionStatus?: string
  onCredentialsLogin?: () => void
  onGithubLogin?: () => void
  onLogout?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  sessionStatus: 'unauthenticated'
})

const statusClass = computed(() => {
  const status = props.sessionStatus.toLowerCase()
  return {
    'success': status === 'authenticated',
    'warning': status === 'loading',
    'error': status === 'unauthenticated'
  }
})

const handleCredentialsLogin = () => {
  if (props.onCredentialsLogin) {
    props.onCredentialsLogin()
  }
}

const handleGithubLogin = () => {
  if (props.onGithubLogin) {
    props.onGithubLogin()
  }
}

const handleLogout = () => {
  if (props.onLogout) {
    props.onLogout()
  }
}
</script>

<style scoped>
.auth-composable-demo {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.auth-composable-demo h2 {
  text-align: center;
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

.subtitle {
  text-align: center;
  margin: 0 0 32px 0;
  color: #6b7280;
  font-size: 16px;
}

.demo-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.label {
  font-weight: 500;
  color: #374151;
}

.value {
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.value.success {
  background: #d1fae5;
  color: #059669;
}

.value.error {
  background: #fee2e2;
  color: #dc2626;
}

.value.warning {
  background: #fef3c7;
  color: #d97706;
}

.json-display {
  background: #1f2937;
  color: #e5e7eb;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
}

.json-display pre {
  margin: 0;
  font-size: 14px;
  font-family: 'Monaco', 'Consolas', monospace;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-btn.primary {
  background: #3b82f6;
}

.action-btn.primary:hover:not(:disabled) {
  background: #2563eb;
}

.action-btn.github {
  background: #24292f;
}

.action-btn.github:hover:not(:disabled) {
  background: #1c2128;
}

.action-btn.danger {
  background: #ef4444;
}

.action-btn.danger:hover:not(:disabled) {
  background: #dc2626;
}

.method-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 4px solid #3b82f6;
  font-size: 14px;
  line-height: 1.5;
}

.method-item strong {
  color: #1f2937;
}

.code-section {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.code-display {
  background: #2d3748;
  color: #e2e8f0;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
}

.code-display pre {
  margin: 0;
  font-size: 14px;
  font-family: 'Monaco', 'Consolas', monospace;
  line-height: 1.6;
}

.code-display code {
  color: #a0aec0;
}
</style>