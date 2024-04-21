import { useLogger } from '@nuxt/kit'

export type { LogLevel } from 'consola/core'
export { colors } from 'consola/utils'

export const logger = useLogger('nuxt:storybook')
