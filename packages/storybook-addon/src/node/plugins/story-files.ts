import type { Plugin } from 'vite'
import {
  SCRIPT_FILE_RE,
  hasMockCall,
  injectStoryFile,
  storyImportPath,
} from '../mock-calls'
import { cleanId } from './module-ids'

/** Tells the mock calls of a story file which file they are in. */
export function storyFilesPlugin(): Plugin {
  // Counts the transforms, so the runtime tells a re-evaluated story file apart
  let generation = 0

  return {
    enforce: 'pre',
    name: 'nuxt-storybook-story-files',
    transform(code, id) {
      const file = cleanId(id)
      if (!SCRIPT_FILE_RE.test(file) || !hasMockCall(code)) {
        return
      }
      return injectStoryFile(code, file, storyImportPath(file), ++generation)
    },
  }
}
