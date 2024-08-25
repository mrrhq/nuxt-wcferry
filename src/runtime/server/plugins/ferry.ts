import { PuppetFerry, FerryAgent, WcfRustApi } from 'wechaty-puppet-ferry'
import type { Message } from 'wechaty'
import { WechatyBuilder } from 'wechaty'
import type { WechatyInterface } from 'wechaty/impls'

export default defineNitroPlugin(async (nitroApp) => {
  const { ferry: ferryConfig } = useRuntimeConfig()
  const api = new WcfRustApi({
    baseURL: ferryConfig?.baseURL,
  })
  const agent = new FerryAgent({
    server: {
      disabled: true,
    },
    api,
  })
  const puppet = new PuppetFerry({ agent })
  const bot = WechatyBuilder.build({ puppet })
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

  await bot.start()

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
