import { resolveStorybookHost } from '../packages/nuxt-module/src/host'

describe(resolveStorybookHost, () => {
  it('passes a host name through', () => {
    expect(resolveStorybookHost('0.0.0.0')).toBe('0.0.0.0')
    expect(resolveStorybookHost('storybook.test')).toBe('storybook.test')
  })

  it('takes the host name of a host given as a url', () => {
    expect(resolveStorybookHost('http://0.0.0.0')).toBe('0.0.0.0')
    expect(resolveStorybookHost('https://storybook.test:8443/')).toBe(
      'storybook.test',
    )
  })

  it('removes the brackets of an ipv6 address', () => {
    expect(resolveStorybookHost('http://[::1]')).toBe('::1')
  })

  it('leaves a value that is not a valid url as it is', () => {
    expect(resolveStorybookHost('http://')).toBe('http://')
  })

  it('keeps the storybook default for the default host', () => {
    expect(resolveStorybookHost('http://localhost')).toBeUndefined()
    expect(resolveStorybookHost('')).toBeUndefined()
    expect(resolveStorybookHost(undefined)).toBeUndefined()
  })
})
