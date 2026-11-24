import { expect, fn } from 'storybook/test'
import preview from '../.storybook/preview'
import NewsletterCard from './NewsletterCard.vue'

const meta = preview.meta({
  title: 'Demo/NewsletterCard',
  component: NewsletterCard,
  tags: ['autodocs'],
  args: {
    onSubscribe: fn(),
    onDismiss: fn(),
  },
})

export const Default = meta.story({})

export const CustomCopy = meta.story({
  args: {
    title: 'Join 10,000 Nuxt developers',
    description: 'One email a month. No spam, unsubscribe anytime.',
  },
})

export const SubscribeSuccess = meta.story({
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(
      canvas.getByLabelText('Email address'),
      'hello@nuxt.com',
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))

    await expect(args.onSubscribe).toHaveBeenCalledWith('hello@nuxt.com')
    await expect(canvas.getByRole('status')).toHaveTextContent(
      "Thanks, you're subscribed!",
    )
  },
})

export const InvalidEmail = meta.story({
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.type(canvas.getByLabelText('Email address'), 'not-an-email')
    await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))

    await expect(args.onSubscribe).not.toHaveBeenCalled()
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Please enter a valid email address.',
    )
  },
})

export const Dismiss = meta.story({
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Dismiss' }))

    await expect(args.onDismiss).toHaveBeenCalledOnce()
  },
})
