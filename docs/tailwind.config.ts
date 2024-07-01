import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        green: {
          50: '#EFFDF5',
          100: '#D9FBE8',
          200: '#B3F5D1',
          300: '#75EDAE',
          400: '#00DC82',
          500: '#00C16A',
          600: '#00A155',
          700: '#007F45',
          800: '#016538',
          900: '#0A5331',
          950: '#052e16',
        },
        // based off FF4785
        'french-rose': {
          '50': '#fef1f6',
          '100': '#fee5ef',
          '200': '#ffcae1',
          '300': '#ff9fc6',
          '400': '#ff639f',
          '500': '#ff4785',
          '600': '#f01252',
          '700': '#d1053a',
          '800': '#ad0730',
          '900': '#8f0c2c',
          '950': '#580014',
        },
      },
    },
  },
}
