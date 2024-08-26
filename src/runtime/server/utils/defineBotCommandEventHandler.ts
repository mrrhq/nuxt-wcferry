import type { EventHandlerRequest, EventHandlerResponse, H3Event } from 'h3'
import type { Message } from 'wechaty'
import { defineBotEventHandler } from './defineBotEventHandler'

export interface CommandHandlerPayload {
  message: Message
  command: string
  args: string
}

export interface BotCommandEventHandlerOptions<Request extends EventHandlerRequest = EventHandlerRequest, Response = EventHandlerResponse> {
  command: string | RegExp
  handler: (payload: CommandHandlerPayload, event?: H3Event<Request>) => Response
}

/**
 * 定义被 @ 时的命令
 */
export const defineBotCommandEventHandler = (options: BotCommandEventHandlerOptions) => {
  const { command, handler } = options
  const regex
    = typeof command === 'string'
      ? new RegExp(`@.*?\\s(${command})(?:\\s([\\S\\s]*))?`)
      : command
  return defineBotEventHandler({
    hooks: 'wcferry:message:room:mention',
    when: regex,
    executeHandlerOnRequest: false,
    handler(msg) {
      if (!msg) return
      const text = msg.text()
      const match = regex.exec(text)!
      const [, cmd, args] = match
      return handler({
        message: msg,
        command: cmd,
        args,
      })
    },
  })
}
