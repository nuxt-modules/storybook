export default defineI18nConfig(() => ({
  defaultLocale: 'en',
  legacy: false,
  locale: 'en',
  messages: {
    ar: {
      welcome: '   ناكست  ❤️  {name}   ❤️  مرحبا بكم في ستوري بوك   ',
    },
    en: {
      welcome: 'Welcome to Storybook  ❤️  {name} ',
    },
    fr: {
      welcome: 'Bienvenue a Storybook ❤️  {name} ',
    },
  },
}))
