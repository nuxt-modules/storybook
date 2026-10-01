import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'
import type { ViteDevServer } from 'vite'

/**
 * Stands in for a real-world stateful Vite plugin (the kind heavier UI
 * libraries such as `@nuxt/ui` ship): it tracks every distinct Vite dev
 * server that has ever called `configureServer` on this particular plugin
 * *instance*, and serves that count over HTTP through the same server.
 *
 * Embedded Storybook used to hand the app's own live, already-configured
 * plugin instances to its own separate Vite server, so `configureServer`
 * fired a second time on the SAME instance for a DIFFERENT server - silently
 * rebinding whatever internal state that instance held toward Storybook's
 * server instead of the app's (#1072). The fix always builds Storybook a
 * freshly extracted config with its own, separately-instantiated plugins,
 * so the app's own plugin instance is configured exactly once no matter how
 * many times Storybook itself (re)starts.
 */
export default defineNuxtModule({
  meta: { name: 'stateful-vite-plugin-probe' },
  setup() {
    const boundServers = new Set<ViteDevServer>()

    addVitePlugin(
      {
        configureServer(server) {
          boundServers.add(server)
          server.middlewares.use('/_probe/bound-servers', (_req, res) => {
            res.setHeader('content-type', 'application/json')
            res.end(JSON.stringify({ boundServerCount: boundServers.size }))
          })
        },
        name: 'stateful-vite-plugin-probe',
      },
      // Client only: Nuxt's server (SSR) Vite build has its own separate
      // `configureServer` call unrelated to Storybook, which would otherwise
      // muddy this instance's count.
      { server: false },
    )
  },
})
