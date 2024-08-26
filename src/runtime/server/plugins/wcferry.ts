import type { Message } from 'wechaty'
import type { WechatyInterface } from 'wechaty/impls'
import type { PuppetWcferry } from 'wechaty-puppet-wcferry'
import { useBotPuppet } from '../utils/useBotPuppet'
import { useBot } from '../utils/useBot'

export default defineNitroPlugin(async (nitroApp) => {
  const puppet = useBotPuppet()
  const bot = useBot()
  await bot.start()
  bot.on('ready', () => {
    bot.on('message', async (msg) => {
      nitroApp.hooks.callHook('wcferry:message', msg)
      const room = msg.room()
      if (room) {
        nitroApp.hooks.callHook('wcferry:message:room', msg)
        if (await msg.mentionSelf()) {
          nitroApp.hooks.callHook('wcferry:message:room:mention', msg)
        }
      }
      else {
        nitroApp.hooks.callHook('wcferry:message:contact', msg)
      }
    })
  })

  nitroApp.wcferry = {
    puppet,
    bot,
  }

  nitroApp.hooks.hook('close', async () => {
    await bot.stop()
  })
})

declare module 'nitropack' {
  interface NitroApp {
    wcferry: {
      bot: WechatyInterface
      puppet: PuppetWcferry
    }
  }

  interface NitroRuntimeHooks {
    'wcferry:message': (msg: Message) => void
    'wcferry:message:room': (msg: Message) => void
    'wcferry:message:room:mention': (msg: Message) => void
    'wcferry:message:contact': (msg: Message) => void
  }
}
