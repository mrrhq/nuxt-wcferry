import { defineNuxtModule, createResolver, addServerScanDir, addServerHandler } from '@nuxt/kit'
import { extendServerRpc, onDevToolsInitialized } from '@nuxt/devtools-kit'
import fb from 'fast-glob'
import { join, relative, resolve, basename, extname } from 'pathe'
import { camelCase } from 'scule'
import type { ClientFunctions, ServerFunctions } from '../types'
import { setupDevToolsUI } from './devtools'

export const GLOB_SCAN_PATTERN = '**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}'
type FileInfo = { path: string, fullPath: string }

async function scanDir(
  dir: string,
  name: string,
): Promise<FileInfo[]> {
  const fileNames = await fb(join(name, GLOB_SCAN_PATTERN), {
    cwd: dir,
    dot: true,
    absolute: true,
  })
  return fileNames
    .map((fullPath) => {
      return {
        fullPath,
        path: relative(join(dir, name), fullPath),
      }
    })
    .sort((a, b) => a.path.localeCompare(b.path))
}

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
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    addServerScanDir(resolver.resolve('./runtime/server'))
    nuxt.options.runtimeConfig['wcferry'] = options
    nuxt.options.nitro ??= {}
    nuxt.options.nitro.experimental ??= {}
    nuxt.options.nitro.experimental.tasks = true

    nuxt.options.watch.push(join(nuxt.options.serverDir!, 'wcferry'))

    nuxt.hook('nitro:init', async (nitro) => {
      const wcferryDirs = nitro.options.scanDirs.map(v => join(v, 'wcferry'))
      // nitro.options.
      const skills = (await Promise.all(wcferryDirs.map(dir => scanDir(dir, 'skills')))).flat()
      nitro.options.virtual['#internal/wcferry/skills'] = async () => {
        return skills.map(v => `import("${v.fullPath}");`).join('\n')
      }

      const middleware = (await Promise.all(wcferryDirs.map(dir => scanDir(dir, 'middleware')))).flat()
      nitro.options.virtual['#internal/wcferry/middleware'] = async () => {
        let importCode = ''
        const globalMiddleware = []
        const localMiddleware = []
        for (const file of middleware) {
          const base = basename(file.path, extname(file.path))
          const isGlobal = base.includes('.global')
          const name = camelCase(base.replace(/\.(global)/, ''))
          importCode += `import { default as ${name} } from "${file.fullPath}";\n`
          if (isGlobal) {
            globalMiddleware.push(name)
          }
          else {
            localMiddleware.push(name)
          }
        }
        importCode += `export const $global = [${globalMiddleware.join(',')}];\n`
        importCode += `export const $local = [${localMiddleware.join(',')}];\n`
        return importCode
      }

      nuxt.options.watch.push(...wcferryDirs)

      nuxt.hook('builder:watch', (event, path) => {
        if (event === 'add' || event === 'unlink') {
          if (wcferryDirs.some(dir => resolve(nuxt.options.srcDir, path).startsWith(dir))) {
            nitro.hooks.callHook('dev:reload')
          }
        }
      })
    })

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
