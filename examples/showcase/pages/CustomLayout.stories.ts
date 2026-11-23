import CustomLayoutPage from './CustomLayout.vue'
import { NuxtLayout } from '#components'
import { provide } from 'vue'
import { PageRouteSymbol } from '#app/components/injections'
import { useRoute } from '#app/composables/router'

const meta = {
  title: 'Features/Pages as Stories with custom layout',
  component: CustomLayoutPage,
  tags: ['autodocs'],
}

export default meta

export const CustomLayoutStory = {
  args: {},
  render: () => ({
    components: { CustomLayoutPage, NuxtLayout },
    setup() {
      provide(PageRouteSymbol, useRoute())
    },
    template: '<NuxtLayout><CustomLayoutPage /></NuxtLayout>',
  }),
}
