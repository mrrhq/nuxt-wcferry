/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ModuleOptions, Nuxt } from 'nuxt/schema'
import { extendServerRpc } from '@nuxt/devtools-kit'
import { setupServerSkillsRPC } from './server-skills'

export function setupRPC(nuxt: Nuxt, _options: ModuleOptions) {
  // @ts-expect-error untyped
  extendServerRpc('wcferry', setupServerSkillsRPC(nuxt.devtools))
}
