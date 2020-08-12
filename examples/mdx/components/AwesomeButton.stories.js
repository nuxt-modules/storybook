import { text } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'

export default {
  title: 'AwesomeButton',
}

export const MyAwesomeButton = () => ({
  template: '<AwesomeButton @click.native="clickme" :label="label" :color="color" />',
  props: {
    label: {
      default: text('Label', 'Awesome button')
    },
    color: {
      default: text('Color Me', '777777')
    }
  },
  methods: {
    clickme () {
      action('button-click')()
    }
  }
})
