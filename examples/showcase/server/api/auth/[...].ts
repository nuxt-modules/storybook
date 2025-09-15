import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import { NuxtAuthHandler } from '@sidebase/nuxt-auth'

export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: process.env.NUXT_AUTH_SECRET || 'your-auth-secret-here',
  providers: [
    // GithubProvider for demo purposes - would need real credentials
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || 'demo-github-id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'demo-github-secret'
    }),
    // Simple credentials provider for demo
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // WARNING: This is for demo purposes only
        // In a real app, check credentials against a database
        if (credentials?.username === 'demo' && credentials?.password === 'demo') {
          return {
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
            image: 'https://avatars.githubusercontent.com/u/1?v=4'
          }
        }
        if (credentials?.username === 'admin' && credentials?.password === 'admin') {
          return {
            id: '2',
            name: 'Admin User',
            email: 'admin@example.com',
            image: 'https://avatars.githubusercontent.com/u/2?v=4',
            role: 'admin'
          }
        }
        return null
      }
    })
  ],
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session: async ({ session, token }) => {
      ;(session as any).role = token.role
      return session
    }
  }
})