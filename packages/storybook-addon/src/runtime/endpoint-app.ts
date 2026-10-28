import type * as H3v1Module from 'h3'
import type { H3Event } from 'h3'
import type { EndpointApp, EndpointHandler } from './endpoints'

/** The `h3` module of either major, as the preview resolves it. */
export type H3Module = H3v1 | H3v2

type H3v1 = Pick<
  typeof H3v1Module,
  'createApp' | 'defineEventHandler' | 'toWebHandler'
>

interface H3v2 {
  H3: new () => {
    use(handler: (event: never) => unknown): {
      request(
        request: Request,
        options: undefined,
        context: Record<string, unknown>,
      ): Response | Promise<Response>
    }
  }
}

export function createEndpointApp(h3: H3Module): EndpointApp {
  return 'H3' in h3 ? createH3v2App(h3) : createH3v1App(h3)
}

function dispatch(event: H3Event): unknown {
  return (event.context.endpoint as EndpointHandler)(event)
}

function createH3v1App(h3: H3v1): EndpointApp {
  const { createApp, defineEventHandler, toWebHandler } = h3
  const handle = toWebHandler(createApp().use(defineEventHandler(dispatch)))

  return { fetch: (request, endpoint) => handle(request, { endpoint }) }
}

function createH3v2App({ H3 }: H3v2): EndpointApp {
  const app = new H3().use(dispatch as never)

  return {
    fetch: (request, endpoint) =>
      Promise.resolve(app.request(request, undefined, { endpoint })),
  }
}
