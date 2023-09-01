import * as _nuxt_schema from '@nuxt/schema';

interface ModuleOptions {
    /**
     * StorybookAPI URL
     * @default process.env.STORYBOOK_URL
     * @example 'http://localhost:6006'
     * @type string
     */
    url?: string;
    /**
     * StorybookVersion
     * @default 'v7'
     * @type string
     * @example 'v8'
     */
    version?: 'v7';
    /**
     * StorybookCookie Name
     * @default 'storybook_jwt'
     * @type string
    */
    cookieName?: string;
    /**
     * Add Storybook  in Nuxt Devtools
     *
     * Please read the instructions on https://storybook.nuxtjs.org/devtools
     *
     * @default false
    */
    devtools?: boolean;
    /**
     * Storybook Route
     * @default '/__storybook_route'
     */
    storybookRoute?: string;
    /**
     * Storybook Port
     * @default 6006
     * @type number
     */
    port?: number;
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions>;

export { ModuleOptions, _default as default };
