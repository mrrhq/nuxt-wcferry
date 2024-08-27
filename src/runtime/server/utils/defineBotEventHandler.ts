/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { EventHandlerRequest, EventHandlerResponse, H3Event } from 'h3'
import type { BotHooks } from './useBot'
import { useBot } from './useBot'
import { createError, defineEventHandler } from '#imports'

type PickMessageKeys<T> = {
  [K in keyof T]: K extends `message${string}` ? K : never;
}[keyof T]

type PickRoomKeys<T> = {
  [K in keyof T]: K extends `room${string}` ? K : never;
}[keyof T]

type MessageKeys = PickMessageKeys<BotHooks>
type RoomKeys = PickRoomKeys<BotHooks>

export type BotEventHandler<Payload, Request extends EventHandlerRequest = EventHandlerRequest, Response = EventHandlerResponse> = (payload?: Payload, event?: H3Event<Request>) => Response

export interface BotEventHandlerObject<Payload, Request extends EventHandlerRequest = EventHandlerRequest, Response = EventHandlerResponse> {
  /**
   * 处理函数
   */
  handler: BotEventHandler<Payload, Request, Response>

  /**
   * request 接口时是否执行 handler
   * @default false
   */
  executeHandlerOnRequest?: boolean

  /**
   * 要在哪个 hook 中执行
   * @default 'message'
   */
  hooks?: (MessageKeys | RoomKeys)[] | MessageKeys | RoomKeys

  /**
   * 仅在满足条件时执行，匹配消息或群名
   * @default true
   */
  when?: RegExp | boolean | ((payload: Payload) => boolean | Promise<boolean>)
}

export type BotEventHandlerOptions<Payload> = BotEventHandler<Payload> | BotEventHandlerObject<Payload>

/**
 * 定义收到消息或群聊事件时的处理函数
 */
export function defineBotEventHandler<Payload>(options: BotEventHandlerOptions<Payload>) {
  const bot = useBot()
  const {
    handler,
    hooks = ['message' as const],
    executeHandlerOnRequest = false,
    when = true,
  } = typeof options === 'function' ? { handler: options } : options
  const _hooks = Array.isArray(hooks) ? hooks : [hooks]

  _hooks.forEach((key) => {
    if (!key.startsWith('message') && !key.startsWith('room')) {
      throw new Error(`hook ${key} is not a valid hook`)
    }
    // @ts-expect-error ignore
    bot.hooks.hook(key, async (payload: Payload) => {
      // 使用群名或消息来做 when 的条件判断
      // @ts-expect-error ignore
      const text = payload?.payload?.text || payload?.payload?.topic || ''
      if (typeof when === 'function') {
        if (await when(payload)) {
          return handler(payload)
        }
      }
      else if (when === true || (when instanceof RegExp && when.test(text))) {
        return handler(payload)
      }
    })
  })
  return defineEventHandler(async (event) => {
    if (executeHandlerOnRequest) {
      return handler(undefined, event)
    }
    throw createError({
      status: 404,
    })
  })
}
