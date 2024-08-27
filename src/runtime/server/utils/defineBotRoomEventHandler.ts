import type { Room } from 'wechaty'
import type { BotEventHandlerOptions } from './defineBotEventHandler'
import { defineBotEventHandler } from './defineBotEventHandler'

export function defineBotRoomEventHandler(options: BotEventHandlerOptions<Room>) {
  return defineBotEventHandler<Room>(options)
}
