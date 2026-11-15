declare module 'nitro/types' {
  interface NitroRuntimeHooks {
    /** Called by Nuxt Content before it writes a document into `llms-full.txt`. */
    'content:llms:generate:document': (
      event: unknown,
      doc: { body: unknown },
      options: unknown,
    ) => void | Promise<void>
  }
}

export {}
