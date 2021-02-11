import Vue from 'vue'
import { prepareForInline } from './nuxt-entry';
import '~storybook';

<% if (options.nuxtOptions.components) { %>import * as components from '../components';
Object.keys(components).forEach(name => Vue.component(name, components[name]))<% } %>;


const globalParameters = <%= devalue(options.parameters) %>;
globalParameters.docs = {
    ...globalParameters.docs,
    prepareForInline
}
export const parameters = globalParameters

export const globalTypes = <%= devalue(options.globalTypes) %>

export const decorators = [<%= options.decorators.map(decorator => `() => "${decorator}"`) %>]
