import type { Message } from 'wechaty'
import type { WechatyInterface } from 'wechaty/impls'
import type { PuppetFerry, WcfRustApi } from 'wechaty-puppet-ferry'
import { useBotApi } from '../utils/useBotApi'
import { useBotPuppet } from '../utils/useBotPuppet'
import { useBot } from '../utils/useBot'

export default defineNitroPlugin(async (nitroApp) => {
  const api = useBotApi()
  const puppet = useBotPuppet()
  const bot = useBot()
  await bot.start()
  bot.on('ready', () => {
    bot.on('message', async (msg) => {
      nitroApp.hooks.callHook('ferry:message', msg)
      const room = msg.room()
      if (room) {
        nitroApp.hooks.callHook('ferry:message:room', msg)
        if (await msg.mentionSelf()) {
          nitroApp.hooks.callHook('ferry:message:room:mention', msg)
        }
      }
      else {
        nitroApp.hooks.callHook('ferry:message:contact', msg)
      }
    })
  })

  nitroApp.ferry = {
    puppet,
    bot,
    api,
  }

  nitroApp.hooks.hook('close', async () => {
    await bot.stop()
  })
})

declare module 'nitropack' {
  interface NitroApp {
    ferry: {
      api: WcfRustApi
      bot: WechatyInterface
      puppet: PuppetFerry
    }
  }

  interface NitroRuntimeHooks {
    'ferry:message': (msg: Message) => void
    'ferry:message:room': (msg: Message) => void
    'ferry:message:room:mention': (msg: Message) => void
    'ferry:message:contact': (msg: Message) => void
  }
}
