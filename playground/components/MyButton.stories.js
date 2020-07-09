export default { title: 'MyButton' }

export const withText = () => '<MyButton>with text</MyButton>'

export const withEmoji = () => ({ template: '<my-button>😀 😎 👍 💯</my-button>' })

export const rounded = () => '<my-button :rounded="true">rounded</my-button>'
