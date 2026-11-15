const CUT = '// ---cut---\n'

/**
 * Removes the Twoslash markup from the code blocks of a minimark body: the `twoslash` meta and
 * the hidden setup before `// ---cut---`. A node is `[tag, props, ...children]`: `['pre', { code, meta }]`.
 */
export function stripTwoslashSetup(node: unknown): void {
  if (typeof node !== 'object' || node === null) {
    return
  }
  if (!Array.isArray(node)) {
    if ('value' in node) {
      stripTwoslashSetup(node.value)
    }
    return
  }
  const [tag, props] = node
  if (tag === 'pre' && typeof props === 'object' && props !== null) {
    if ('code' in props && typeof props.code === 'string') {
      const cut = props.code.indexOf(CUT)
      props.code = cut === -1 ? props.code : props.code.slice(cut + CUT.length)
    }
    if ('meta' in props && typeof props.meta === 'string') {
      props.meta = props.meta.replace('twoslash', '').trim()
    }
  }
  for (const child of node) {
    stripTwoslashSetup(child)
  }
}
