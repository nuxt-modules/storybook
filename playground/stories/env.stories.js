export default {
    title: "Environment Variables"
}

export const listVariables = () => {
    return `
        <ul>
            <li>STORYBOOK_LIFE_UNIVERSE_AND_EVERYTHING: ${process.env.STORYBOOK_LIFE_UNIVERSE_AND_EVERYTHING}</li>
        </ul>
    `
}