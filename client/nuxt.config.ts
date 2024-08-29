import { createResolver } from 'nuxt/kit'
import DevtoolsUIKit from '@nuxt/devtools-ui-kit'

const resolver = createResolver(import.meta.url)

export default defineNuxtConfig({
  ssr: false,

  modules: [
    DevtoolsUIKit,
    '@unocss/nuxt',
    'nuxt-monaco-editor',
  ],

  devtools: {
    enabled: false,
  },

  future: {
    compatibilityVersion: 4,
  },

  nitro: {
    output: {
      publicDir: resolver.resolve(__dirname, '../dist/client'),
    },
  },

  app: {
    baseURL: '/__wcferry__/devtools',
  },

  compatibilityDate: '2024-08-27',

  monacoEditor: { lang: 'zh-cn' },
})
