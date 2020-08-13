import Vue from 'vue'
import '~storybook';

<% if (options.components) { %>import * as components from '~~/.nuxt-storybook/components';
Object.keys(components).forEach(name => Vue.component(name, components[name]))<% } %>
