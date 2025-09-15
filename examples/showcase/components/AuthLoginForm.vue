<template>
  <div class="auth-login-form">
    <h2>Login to your account</h2>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="username">Username:</label>
        <input
          id="username"
          v-model="credentials.username"
          type="text"
          placeholder="Enter username"
          required
        />
        <small class="hint">Use 'demo' or 'admin' for demo purposes</small>
      </div>
      
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          id="password"
          v-model="credentials.password"
          type="password"
          placeholder="Enter password"
          required
        />
        <small class="hint">Use 'demo' or 'admin' for demo purposes</small>
      </div>
      
      <div class="form-actions">
        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
        
        <button 
          type="button" 
          @click="handleGithubLogin" 
          :disabled="loading"
          class="github-btn"
        >
          {{ loading ? 'Loading...' : 'Sign in with GitHub' }}
        </button>
      </div>
    </form>
    
    <div class="demo-credentials">
      <h3>Demo Credentials:</h3>
      <p><strong>Regular User:</strong> demo / demo</p>
      <p><strong>Admin User:</strong> admin / admin</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LoginCredentials {
  username: string
  password: string
}

interface Props {
  onLogin?: (credentials: LoginCredentials) => void
  onGithubLogin?: () => void
  loading?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: ''
})

const credentials = ref<LoginCredentials>({
  username: '',
  password: ''
})

const error = toRef(props, 'error')
const loading = toRef(props, 'loading')

const handleLogin = () => {
  if (props.onLogin) {
    props.onLogin(credentials.value)
  }
}

const handleGithubLogin = () => {
  if (props.onGithubLogin) {
    props.onGithubLogin()
  }
}
</script>

<style scoped>
.auth-login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 24px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.auth-login-form h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #1f2937;
  font-size: 24px;
  font-weight: 600;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-group input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.hint {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.login-btn, .github-btn {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.login-btn {
  background: #3b82f6;
  color: white;
}

.login-btn:hover:not(:disabled) {
  background: #2563eb;
}

.login-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.github-btn {
  background: #24292f;
  color: white;
}

.github-btn:hover:not(:disabled) {
  background: #1c2128;
}

.github-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.demo-credentials {
  margin-top: 24px;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 6px;
  font-size: 14px;
}

.demo-credentials h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #374151;
}

.demo-credentials p {
  margin: 4px 0;
  color: #6b7280;
}
</style>