import { WechatyBuilder } from 'wechaty'
import type { WechatyInterface } from 'wechaty/impls'
import { useBotPuppet } from './useBotPuppet'

let bot: WechatyInterface

export function useBot() {
  const puppet = useBotPuppet()
  if (!bot) {
    bot = WechatyBuilder.build({ puppet })
  }

  return bot
}
