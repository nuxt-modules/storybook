export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    defaultLocale: 'en',
    messages: {
      en: {
        welcome: 'Welcome to Storybook  ❤️  {name} '
      },
      fr: {
        welcome: 'Bienvenue a Storybook ❤️  {name} '
      },
      ar: {
        welcome: '   ناكست  ❤️  {name}   ❤️  مرحبا بكم في ستوري بوك   '
      }
    }
  }))
  