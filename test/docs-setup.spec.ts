// @vitest-environment node

import {
  NuxtSpySharedOnDocsPageError,
  beginDocsSetup,
  endDocsSetup,
  failDocsSetup,
  trackConfiguration,
} from '../packages/storybook-addon/src/runtime/docs-setup'

const useGreeting = trackConfiguration(
  vi.fn((name: string) => `Hello ${name}`).mockName('useGreeting'),
)

const cleanups: (() => void)[] = []

function canvas() {
  return { isConnected: true }
}

/** Starts a story of a docs page the way the preview `beforeEach` does. */
function begin(storyId: string, element = canvas()) {
  cleanups.push(beginDocsSetup(storyId, element))
  return element
}

afterEach(() => {
  for (const cleanup of cleanups.splice(0)) {
    cleanup()
  }
  useGreeting.mockReset()
})

describe(trackConfiguration, () => {
  it('keeps the spy working, and chainable', () => {
    expect(useGreeting('Nuxt')).toBe('Hello Nuxt')
    expect(useGreeting).toHaveBeenCalledWith('Nuxt')
    expect(useGreeting.mockReturnValue('a').mockName('useGreeting')).toBe(
      useGreeting,
    )
    expect(useGreeting('Nuxt')).toBe('a')
  })

  it('lets a story rendered alone configure the spy', () => {
    useGreeting.mockReturnValue('a')

    expect(useGreeting('Nuxt')).toBe('a')
  })

  it('lets the only story of a docs page configure the spy, in both of its renders', () => {
    begin('a')
    useGreeting.mockReturnValue('a')
    begin('a')
    useGreeting.mockReturnValue('a')

    expect(useGreeting('Nuxt')).toBe('a')
  })

  it('throws when a story configures the spy while another one is on the docs page', () => {
    begin('a')
    begin('b')

    expect(() => useGreeting.mockReturnValue('b')).toThrow(
      NuxtSpySharedOnDocsPageError,
    )
    expect(() => useGreeting.mockImplementation(() => 'b')).toThrow(
      'parameters: { docs: { story: { inline: false } } }',
    )
    expect(useGreeting('Nuxt')).toBe('Hello Nuxt')
  })

  it('throws when a story starts on a docs page where another one configured the spy', () => {
    endDocsSetup(begin('a'))
    const other = begin('a')
    useGreeting.mockResolvedValueOnce('a')
    endDocsSetup(other)

    expect(() => begin('b')).toThrow(NuxtSpySharedOnDocsPageError)
  })

  it('lets stories share a docs page when none configures the spy', () => {
    begin('a')
    begin('b')

    expect(useGreeting('Nuxt')).toBe('Hello Nuxt')
    expect(useGreeting).toHaveBeenCalledOnce()
  })

  it('leaves alone a spy configured once every story is mounted', () => {
    endDocsSetup(begin('a'))
    endDocsSetup(begin('b'))

    useGreeting.mockReturnValue('clicked')

    expect(useGreeting('Nuxt')).toBe('clicked')
  })

  it('ends the setup of a story that failed', () => {
    begin('a')
    endDocsSetup(begin('b'))
    failDocsSetup('a')

    useGreeting.mockReturnValue('clicked')

    expect(useGreeting('Nuxt')).toBe('clicked')
  })

  it('forgets the stories of a docs page the user left', () => {
    const left = begin('a')
    useGreeting.mockReturnValue('a')
    left.isConnected = false

    begin('b')
    useGreeting.mockReturnValue('b')

    expect(useGreeting('Nuxt')).toBe('b')
  })

  it('is not configured by a reset or a restore', () => {
    begin('a')
    begin('b')

    expect(() => useGreeting.mockReset()).not.toThrow()
    expect(() => useGreeting.mockRestore()).not.toThrow()
  })
})
