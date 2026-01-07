import '@nuxtjs/i18n'

declare module '@nuxtjs/i18n' {
  interface LocaleObject {
    dir?: 'ltr' | 'rtl'
  }
}
