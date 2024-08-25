import { defineNuxtModule, createResolver, addServerScanDir, logger } from '@nuxt/kit'
import { colors } from 'consola/utils'

export interface ModuleOptions {
  baseURL: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'ferry',
    configKey: 'ferry',
  },
  defaults: {
    baseURL: 'http://127.0.0.1:10010',
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    addServerScanDir(resolver.resolve('./runtime/server'))
    nuxt.options.runtimeConfig['ferry'] = options
    nuxt.options.nitro ??= {}
    nuxt.options.nitro.experimental ??= {}
    nuxt.options.nitro.experimental.tasks = true
    logger.log(`${colors.blueBright('  ➜ NuxtFerry:')} ${colors.cyan(`${nuxt.options.devServer.url}/wcf-rust-callback`)}`)
  },
})

declare module 'nuxt/schema' {
  interface RuntimeConfig {
    ferry: {
      baseURL: string
    }
  }
}
