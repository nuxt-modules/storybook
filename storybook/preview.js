import Vue from 'vue'
import '~storybook';

<% if (options.nuxtOptions.components) { %>import * as components from '../components';
Object.keys(components).forEach(name => Vue.component(name, components[name]))<% } %>
