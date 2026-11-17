import { z } from 'zod'

export default defineMcpTool({
  cache: '1h',
  description: `Retrieves the steps to upgrade a project to the next major version of the Nuxt Storybook module.

WHEN TO USE: Use this tool when the user wants to upgrade or migrate Nuxt Storybook, or when a project fails after upgrading. Common use cases:
- "Upgrade my project to Storybook 11" → from: v10
- "What changed in @nuxtjs/storybook v11?" → from: v10
- "Migrate from Nuxt Storybook v9" → from: v9, then from: v10
- Errors about removed options such as \`port\`, \`host\` or \`https\`

WORKFLOW: This tool returns the markdown of one upgrade, with the commands to run, the removed options and the breaking changes. Apply the upgrades in order when a project is more than one major version behind.`,
  handler: async ({ from }) => {
    const guide = await migrationGuide(useEvent(), from)
    if (guide === undefined) {
      return {
        content: [{ text: 'Migration guide not found', type: 'text' }],
        isError: true,
      }
    }
    return { content: [{ text: guide, type: 'text' }] }
  },
  inputSchema: {
    from: z
      .enum(['v9', 'v10'])
      .default('v10')
      .describe('Major version of @nuxtjs/storybook the project upgrades from'),
  },
})
