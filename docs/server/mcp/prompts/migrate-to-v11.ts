export default defineMcpPrompt({
  description:
    'Upgrade the current project from Nuxt Storybook v10 to v11 (Storybook 11).',
  handler: async () => {
    const guide = await migrationGuide(useEvent(), 'v10')
    return `Upgrade this project from Nuxt Storybook v10 to v11 by following the migration guide below.

- Install Storybook 11 from the \`next\` npm tag until it is released.
- Remove the module options and APIs the guide lists as removed.
- Move \`.storybook/main.ts\`, \`.storybook/preview.ts\` and the stories to CSF Factories.
- Run Storybook afterwards and fix the stories that fail.

${guide ?? 'The migration guide could not be loaded: call the get-migration-guide tool.'}`
  },
})
