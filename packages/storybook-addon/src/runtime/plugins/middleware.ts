import { abortNavigation, addRouteMiddleware, defineNuxtPlugin } from 'nuxt/app'
import { fn } from 'storybook/test'

export default defineNuxtPlugin({
  name: 'storybook:navigation-middleware',
  setup(nuxtApp) {
    const navigate = fn().mockName('navigate')

    nuxtApp.hook('app:suspense:resolve', () => {
      addRouteMiddleware(
        'storybook-navigation',
        (to, from) => {
          navigate({
            to: to.fullPath,
            from: from.fullPath,
          })
          return abortNavigation()
        },
        {
          global: true,
        },
      )
    })
  },
})
