import type { Message } from 'wechaty'
import type { BotEventHandlerOptions } from './defineBotEventHandler'
import { defineBotEventHandler } from './defineBotEventHandler'

export function defineBotMessageEventHandler(options: BotEventHandlerOptions<Message>) {
  return defineBotEventHandler<Message>(options)
}
