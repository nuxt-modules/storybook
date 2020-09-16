import { action } from '@storybook/addon-actions'

export default {
  title: 'AwesomeButton',
}

export const MyAwesomeButton = ({ label }) => ({
  template: '<AwesomeButton @click.native="clickme" :label="label" :color="color" />',
  props: {
    label: {
      default: 'Awesome button'
    },
    color: {
      default: '#777777'
    }
  },
  methods: {
    clickme () {
      action('button-click')()
    }
  }
})
MyAwesomeButton.argTypes = {
  label: {
    type: { name: 'string' },
    defaultValue: "Awesome button"
  },
  color: { control: 'color' },
}