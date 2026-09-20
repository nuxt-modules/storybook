import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'pathe'

export const distDir = dirname(fileURLToPath(import.meta.url))

export const runtimeDir = resolve(distDir, 'runtime')

// dirs that should be served by Storybook's dev server
export const servableDirs = [distDir, resolve(distDir, '..'), runtimeDir]
