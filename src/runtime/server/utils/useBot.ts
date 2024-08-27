import type { Message } from 'wechaty'
import { WechatyBuilder } from 'wechaty'
import type { RoomInterface, RoomInvitationInterface, WechatyInterface } from 'wechaty/impls'
import type { Hookable } from 'hookable'
import { createHooks } from 'hookable'
import { useBotPuppet } from './useBotPuppet'

export interface BotHooks {
  'message': (msg: Message) => void
  'message:room': (msg: Message) => void
  'message:room:mention': (msg: Message) => void
  'message:contact': (msg: Message) => void
  'room': (room: RoomInterface) => void
  'room:join': (room: RoomInterface) => void
  'room:leave': (room: RoomInterface) => void
  'room:topic': (room: RoomInterface) => void
  'room:invite': (room: RoomInvitationInterface) => void
}

let bot: WechatyInterface & {
  hooks: Hookable<BotHooks>
}

export function useBot(): typeof bot {
  const puppet = useBotPuppet()
  if (!bot) {
    const _bot = WechatyBuilder.build({ puppet })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error ignore
    bot = Object.assign(_bot, { hooks: createHooks() })
  }

  return bot
}
