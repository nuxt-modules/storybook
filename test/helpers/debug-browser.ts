/**
 * CDP-Enhanced Browser Debugging Helper
 *
 * Provides comprehensive browser monitoring for debugging proxy errors,
 * network issues, and Storybook/Nuxt state problems.
 */
import type {
  Page,
  ConsoleMessage,
  Request,
  Response,
  CDPSession,
} from '@playwright/test'
import { test as base, expect } from '@playwright/test'

// Types for debug context
export interface NetworkEntry {
  request: Request
  response?: Response
  failure?: string
  timing?: {
    startTime: number
    endTime?: number
    duration?: number
  }
}

export interface DebugContext {
  consoleMessages: ConsoleMessage[]
  networkRequests: NetworkEntry[]
  pageErrors: Error[]
  cdpExceptions: unknown[]
  proxyErrors: NetworkEntry[]
}

export interface NuxtState {
  payload: unknown
  errors: unknown[]
  config?: unknown
}

export interface StorybookState {
  hasClientAPI: boolean
  hasPreview: boolean
  currentStory?: unknown
  errorBoundaryTriggered: boolean
  iframeErrors?: string[]
}

// Color codes for terminal output
const colors = {
  red: '\x1B[31m',
  yellow: '\x1B[33m',
  green: '\x1B[32m',
  cyan: '\x1B[36m',
  gray: '\x1B[90m',
  reset: '\x1B[0m',
}

function log(level: string, color: string, message: string, details?: string) {
  console.log(`${color}[${level}]${colors.reset} ${message}`)
  if (details) {
    console.log(`${colors.gray}  ${details}${colors.reset}`)
  }
}

/**
 * Extended test fixture with debug context and CDP monitoring
 */
export const test = base.extend<{
  debugContext: DebugContext
  cdpSession: CDPSession
  nuxtMonitor: {
    getState: () => Promise<NuxtState>
    getStorybookState: () => Promise<StorybookState>
    logFullState: () => Promise<void>
    waitForNuxtReady: () => Promise<void>
  }
}>({
  // Debug context collects all browser events
  debugContext: async ({ page }, use) => {
    const context: DebugContext = {
      consoleMessages: [],
      networkRequests: [],
      pageErrors: [],
      cdpExceptions: [],
      proxyErrors: [],
    }

    // Track request timings
    const requestTimings = new Map<Request, number>()

    // Capture all console messages
    page.on('console', (msg) => {
      context.consoleMessages.push(msg)
      const type = msg.type()
      const text = msg.text()

      // Color-code by type
      if (type === 'error') {
        log('CONSOLE ERROR', colors.red, text, msg.location().url)
      } else if (type === 'warning') {
        log('CONSOLE WARN', colors.yellow, text)
      } else if (
        text.toLowerCase().includes('proxy') ||
        text.toLowerCase().includes('cors') ||
        text.toLowerCase().includes('fetch')
      ) {
        // Highlight proxy-related messages
        log('CONSOLE (proxy-related)', colors.cyan, text)
      }
    })

    // Capture uncaught page errors
    page.on('pageerror', (error) => {
      context.pageErrors.push(error)
      log('PAGE ERROR', colors.red, error.message, error.stack)
    })

    // Monitor all network requests
    page.on('request', (request) => {
      requestTimings.set(request, Date.now())
      const entry: NetworkEntry = {
        request,
        timing: { startTime: Date.now() },
      }
      context.networkRequests.push(entry)

      const url = request.url()
      // Log requests that might involve proxy
      if (
        url.includes('/_nuxt/') ||
        url.includes('/__nuxt') ||
        url.includes('/api/') ||
        !url.startsWith('http://localhost:6006')
      ) {
        log('REQUEST', colors.cyan, `${request.method()} ${url}`)
      }
    })

    // Capture responses
    page.on('response', (response) => {
      const request = response.request()
      const entry = context.networkRequests.find((r) => r.request === request)

      if (entry) {
        entry.response = response
        if (entry.timing) {
          entry.timing.endTime = Date.now()
          entry.timing.duration = entry.timing.endTime - entry.timing.startTime
        }
      }

      const status = response.status()
      const url = response.url()

      // Log error responses
      if (status >= 400) {
        log(
          'RESPONSE ERROR',
          colors.red,
          `${status} ${url}`,
          `Duration: ${entry?.timing?.duration}ms`,
        )

        // Track as proxy error if it looks like a proxy issue
        if (
          status === 502 ||
          status === 503 ||
          status === 504 ||
          url.includes('/_nuxt/')
        ) {
          if (entry) context.proxyErrors.push(entry)
        }
      }
    })

    // Capture request failures (network errors, CORS, etc.)
    page.on('requestfailed', (request) => {
      const failure = request.failure()
      const entry = context.networkRequests.find((r) => r.request === request)

      if (entry) {
        entry.failure = failure?.errorText
      }

      log(
        'REQUEST FAILED',
        colors.red,
        request.url(),
        `Error: ${failure?.errorText}`,
      )

      // Most failed requests are proxy-related
      if (entry) {
        context.proxyErrors.push(entry)
      }
    })

    await use(context)

    // Print summary at end of test
    console.log('\n' + '='.repeat(60))
    console.log('DEBUG SUMMARY')
    console.log('='.repeat(60))
    console.log(
      `Console errors: ${context.consoleMessages.filter((m) => m.type() === 'error').length}`,
    )
    console.log(`Page errors: ${context.pageErrors.length}`)
    console.log(
      `Failed requests: ${context.networkRequests.filter((r) => r.failure).length}`,
    )
    console.log(
      `HTTP errors (4xx/5xx): ${context.networkRequests.filter((r) => r.response && r.response.status() >= 400).length}`,
    )
    console.log(
      `${colors.red}Proxy-related errors: ${context.proxyErrors.length}${colors.reset}`,
    )

    if (context.proxyErrors.length > 0) {
      console.log('\nProxy Error Details:')
      for (const entry of context.proxyErrors) {
        console.log(`  - ${entry.request.url()}`)
        if (entry.failure) console.log(`    Failure: ${entry.failure}`)
        if (entry.response)
          console.log(`    Status: ${entry.response.status()}`)
      }
    }
    console.log('='.repeat(60) + '\n')
  },

  // CDP Session for low-level browser access
  cdpSession: async ({ page }, use) => {
    const client = await page.context().newCDPSession(page)

    // Enable relevant CDP domains
    await client.send('Runtime.enable')
    await client.send('Network.enable')
    await client.send('Log.enable')

    // Monitor runtime exceptions
    client.on('Runtime.exceptionThrown', (event) => {
      log(
        'CDP EXCEPTION',
        colors.red,
        event.exceptionDetails.text || 'Unknown exception',
        JSON.stringify(event.exceptionDetails.stackTrace?.callFrames?.[0]),
      )
    })

    // Monitor console API calls at CDP level (catches more than page.on('console'))
    client.on('Runtime.consoleAPICalled', (event) => {
      if (event.type === 'error' || event.type === 'warning') {
        const args = event.args.map((arg) => arg.value || arg.description)
        log(
          `CDP ${event.type.toUpperCase()}`,
          event.type === 'error' ? colors.red : colors.yellow,
          args.join(' '),
        )
      }
    })

    // Monitor network events at CDP level for more detail
    client.on('Network.loadingFailed', (event) => {
      log(
        'CDP NETWORK FAILED',
        colors.red,
        `RequestId: ${event.requestId}`,
        `Error: ${event.errorText}, Canceled: ${event.canceled}`,
      )
    })

    await use(client)

    // Cleanup
    await client.send('Runtime.disable')
    await client.send('Network.disable')
    await client.send('Log.disable')
  },

  // Nuxt/Storybook state monitor
  nuxtMonitor: async ({ page }, use) => {
    const getState = async (): Promise<NuxtState> => {
      return page.evaluate(() => {
        const win = window as unknown as {
          __NUXT__?: unknown
          __NUXT_ERRORS__?: unknown[]
          useNuxtApp?: () => { payload?: unknown; $config?: unknown }
        }

        let payload = win.__NUXT__
        let config: unknown

        // Try to get more detailed state if Nuxt app is available
        try {
          if (typeof win.useNuxtApp === 'function') {
            const app = win.useNuxtApp()
            payload = app.payload
            config = app.$config
          }
        } catch {
          // useNuxtApp not available outside setup
        }

        return {
          payload,
          errors: win.__NUXT_ERRORS__ || [],
          config,
        }
      })
    }

    const getStorybookState = async (): Promise<StorybookState> => {
      return page.evaluate(() => {
        const win = window as unknown as {
          __STORYBOOK_CLIENT_API__?: unknown
          __STORYBOOK_PREVIEW__?: { currentSelection?: unknown }
          __STORYBOOK_STORY_STORE__?: unknown
        }

        const preview = win.__STORYBOOK_PREVIEW__

        // Check for error displays
        const errorDisplay = document.querySelector('.sb-errordisplay')
        const errorMessage = document.querySelector('#error-message')

        // Check iframe for errors
        const iframe = document.querySelector(
          '#storybook-preview-iframe',
        ) as HTMLIFrameElement
        const iframeErrors: string[] = []

        try {
          if (iframe?.contentDocument) {
            const iframeErrorEl =
              iframe.contentDocument.querySelector('#error-message')
            if (iframeErrorEl?.textContent) {
              iframeErrors.push(iframeErrorEl.textContent)
            }
          }
        } catch {
          // Cross-origin iframe, can't access
        }

        return {
          hasClientAPI: !!win.__STORYBOOK_CLIENT_API__,
          hasPreview: !!preview,
          currentStory: preview?.currentSelection,
          errorBoundaryTriggered:
            !!errorDisplay ||
            (!!errorMessage && errorMessage.textContent !== ''),
          iframeErrors,
        }
      })
    }

    const logFullState = async () => {
      console.log('\n' + '-'.repeat(40))
      console.log('APPLICATION STATE')
      console.log('-'.repeat(40))

      try {
        const nuxt = await getState()
        console.log('Nuxt State:')
        console.log(`  Payload exists: ${!!nuxt.payload}`)
        console.log(`  Errors: ${JSON.stringify(nuxt.errors)}`)
        if (nuxt.config) {
          console.log(`  Config: ${JSON.stringify(nuxt.config, null, 2)}`)
        }
      } catch (e) {
        console.log(`  Could not retrieve Nuxt state: ${e}`)
      }

      try {
        const sb = await getStorybookState()
        console.log('Storybook State:')
        console.log(`  Client API: ${sb.hasClientAPI}`)
        console.log(`  Preview: ${sb.hasPreview}`)
        console.log(`  Current story: ${JSON.stringify(sb.currentStory)}`)
        console.log(`  Error boundary triggered: ${sb.errorBoundaryTriggered}`)
        if (sb.iframeErrors.length > 0) {
          console.log(`  Iframe errors: ${sb.iframeErrors.join(', ')}`)
        }
      } catch (e) {
        console.log(`  Could not retrieve Storybook state: ${e}`)
      }

      console.log('-'.repeat(40) + '\n')
    }

    const waitForNuxtReady = async () => {
      await page.waitForFunction(
        () => {
          const win = window as unknown as { __NUXT__?: unknown }
          return !!win.__NUXT__
        },
        { timeout: 10000 },
      )
    }

    await use({
      getState,
      getStorybookState,
      logFullState,
      waitForNuxtReady,
    })
  },
})

export { expect }

/**
 * Utility to wait for network idle with proxy awareness
 */
export async function waitForNetworkIdleWithLogging(
  page: Page,
  options: { timeout?: number; idleTime?: number } = {},
) {
  const { timeout = 30000, idleTime = 500 } = options

  let lastRequestTime = Date.now()
  let pendingRequests = 0

  const onRequest = () => {
    pendingRequests++
    lastRequestTime = Date.now()
  }

  const onResponse = () => {
    pendingRequests--
    lastRequestTime = Date.now()
  }

  page.on('request', onRequest)
  page.on('response', onResponse)
  page.on('requestfailed', onResponse)

  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (pendingRequests === 0 && Date.now() - lastRequestTime >= idleTime) {
      break
    }
    await page.waitForTimeout(100)
  }

  page.off('request', onRequest)
  page.off('response', onResponse)
  page.off('requestfailed', onResponse)

  if (pendingRequests > 0) {
    console.log(
      `${colors.yellow}[WARN] Network not fully idle, ${pendingRequests} requests pending${colors.reset}`,
    )
  }
}
