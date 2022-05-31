import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  rootDir: __dirname,
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN
  },
  github: {
    owner: 'nuxt-community',
    repo: 'storybook',
    branch: 'dev'
  },
  loading: { color: '#ff4785' },
  extends: ['./node_modules/@docus/docs-theme'],
  modules: ['@nuxthq/admin', '@docus/github', 'vue-plausible'],
  plausible: {
    domain: 'storybook.nuxtjs.org'
  }
})
