import type { EventHandlerRequest, EventHandlerResponse, H3Event } from 'h3'
import type { NitroRuntimeHooks } from 'nitropack'
import type { Message } from 'wechaty'

type NitroRuntimeHookKeys = keyof NitroRuntimeHooks

export interface BotEventHandlerOptions<Request extends EventHandlerRequest = EventHandlerRequest, Response = EventHandlerResponse> {
  /**
   * 处理函数
   *
   * `event` 参数仅在 request 可用
   * `message` 参数仅在 hook 可用
   */
  handler: (message: Message | null, event?: H3Event<Request>) => Response

  /**
   * request 接口时是否执行 handler
   * @default true
   */
  executeHandlerOnRequest: boolean

  /**
   * 要在哪个 hook 中执行，默认为收到消息就执行
   * @default 'wcferry:message'
   */
  hooks?: NitroRuntimeHookKeys[] | NitroRuntimeHookKeys

  /**
   * 仅在满足条件时执行，请求执行时忽略
   */
  when?: RegExp | boolean | ((msg: Message) => boolean | Promise<boolean>)
}

/**
 * 定义收到消息时的指令
 *
 * 可以是任意消息、@消息、群消息、私聊消息
 */
export const defineBotEventHandler = (options: BotEventHandlerOptions) => {
  const nitroApp = useNitroApp()
  const { handler, hooks = ['wcferry:message'], executeHandlerOnRequest, when = true } = options
  const _hooks = Array.isArray(hooks) ? hooks : [hooks]

  _hooks.map((key) => {
    nitroApp.hooks.hook(key, async (msg: Message) => {
      if (typeof when === 'function') {
        if (await when(msg)) {
          return handler(msg)
        }
      }
      else if (when === true || (when instanceof RegExp && when.test(msg.text()))) {
        return handler(msg)
      }
    })
  })
  return defineEventHandler(async (event) => {
    if (executeHandlerOnRequest) {
      return handler(null, event)
    }
    throw createError({
      status: 404,
    })
  })
}
