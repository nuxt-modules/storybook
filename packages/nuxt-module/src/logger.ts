import { useLogger } from '@nuxt/kit'
import type { ConsolaInstance } from 'consola'

export type { LogLevel } from 'consola/core'
export { colors } from 'consola/utils'

export const logger: ConsolaInstance = useLogger('nuxt:storybook')
