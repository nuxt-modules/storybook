import type { Plugin } from 'vite'
import { SCRIPT_FILE_RE, hasFileCall } from '../calls'
import {
  DEFAULT_STORY_HOOKS,
  allowNestedAwaits,
  hasStoryHook,
  keepStoryContext,
  wrapStoryHooks,
} from '../story-hooks'
import { cleanId } from './module-ids'

/**
 * Runs the hooks of the story files calling the mock functions in the context
 * of their story, kept after each of their `await`s, so the spies they use and
 * the mocks and endpoints they register are the ones of their story.
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
          !hasFileCall(code) ||
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
    {
      // A step of its own, for Vite to chain its source map
      enforce: 'post',
      name: 'nuxt-storybook-story-nested-awaits',
      transform(code, id) {
        return allowNestedAwaits(code, cleanId(id))
      },
    },
  ]
}
