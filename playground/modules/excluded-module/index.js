export default function() {
    const { nuxt } = this

    nuxt.hook('storybook:config', config => {
        config.stories.push(__dirname + "/*.stories.js")
    })
}