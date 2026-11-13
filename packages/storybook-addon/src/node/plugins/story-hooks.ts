import type { Plugin } from 'vite'
import { MOCK_CALLS, SCRIPT_FILE_RE } from '../mock-calls'
import {
  DEFAULT_STORY_HOOKS,
  hasStoryHook,
  keepStoryContext,
  wrapStoryHooks,
} from '../story-hooks'
import { cleanId } from './module-ids'

/**
 * Runs the hooks of the story files mocking auto-imports in the context of
 * their story, kept after each of their `await`s, so the spies they use are
 * the ones of their story.
 */
export function storyHooksPlugins(hooks = DEFAULT_STORY_HOOKS): Plugin[] {
  return [
    {
      enforce: 'pre',
      name: 'nuxt-storybook-story-hooks',
      transform(code, id) {
        const file = cleanId(id)
        if (
          !SCRIPT_FILE_RE.test(file) ||
          !code.includes(MOCK_CALLS.imports) ||
          !hasStoryHook(code, hooks)
        ) {
          return
        }
        return wrapStoryHooks(code, file, hooks)
      },
    },
    {
      // Once the story file is plain JavaScript, which unctx parses
      enforce: 'post',
      name: 'nuxt-storybook-story-awaits',
      transform(code, id) {
        return keepStoryContext(code, cleanId(id))
      },
    },
  ]
}
