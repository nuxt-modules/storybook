import type { Plugin } from 'vite'
import {
  SCRIPT_FILE_RE,
  hasFileCall,
  injectStoryFile,
  storyImportPath,
} from '../mock-calls'
import { cleanId } from './module-ids'

/** Tells the mock and endpoint calls of a story file which file and story they are in. */
export function storyFilesPlugin(): Plugin {
  // Counts the transforms, so the runtime tells a re-evaluated story file apart
  let generation = 0

  return {
    enforce: 'pre',
    name: 'nuxt-storybook-story-files',
    transform(code, id) {
      const file = cleanId(id)
      if (!SCRIPT_FILE_RE.test(file) || !hasFileCall(code)) {
        return
      }
      return injectStoryFile(code, file, storyImportPath(file), ++generation)
    },
  }
}
