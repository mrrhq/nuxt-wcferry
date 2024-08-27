import { defineNuxtModule, createResolver, addServerScanDir, addServerHandler } from '@nuxt/kit'
import { extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import type { ClientFunctions, ServerFunctions } from '../types'
import { setupDevToolsUI } from './devtools'

export interface ModuleOptions {
  debug: boolean
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'wcferry',
    configKey: 'wcferry',
  },
  defaults: {
    debug: false,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    addServerScanDir(resolver.resolve('./runtime/server'))
    nuxt.options.runtimeConfig['wcferry'] = options
    nuxt.options.nitro ??= {}
    nuxt.options.nitro.experimental ??= {}
    nuxt.options.nitro.experimental.tasks = true

    if (options.debug || nuxt.options.dev) {
      addServerHandler({
        route: '/__wcferry__/debug.json',
        handler: resolver.resolve('./runtime/nitro/routes/__wcferry__/debug'),
      })
      setupDevToolsUI(options, resolver.resolve)
      onDevToolsInitialized(() => {
        const rpc = extendServerRpc<ClientFunctions, ServerFunctions>('custom-rpc', {
          toUpperCase(t: string) {
            rpc.broadcast.greeting('world')
            return `${t.toUpperCase()} [from server]`
          },
        })
      })
    }
  },
})

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    wcferry: object
  }
}
