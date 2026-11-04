/** The documented default of the `host` module option. */
const DEFAULT_HOST = 'http://localhost'

/**
 * Turns the `host` module option into the host name Storybook's dev server
 * listens on (what `storybook dev --host` takes).
 *
 * The option may be a bare host name (`0.0.0.0`) or a URL, as in its default
 * `http://localhost`. The default gives `undefined`, so Storybook keeps
 * listening on all interfaces as it did before the option was passed on.
 */
export function resolveStorybookHost(
  host: string | undefined,
): string | undefined {
  if (!host || host === DEFAULT_HOST) {
    return undefined
  }
  if (!host.includes('://')) {
    return host
  }
  try {
    // IPv6 host names come back in brackets (`[::1]`), which `listen` rejects
    return new URL(host).hostname.replace(/^\[|\]$/g, '') || undefined
  } catch {
    return host
  }
}
