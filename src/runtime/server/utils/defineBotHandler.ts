import { useBot, type BotHooks } from './useBot'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { $global, $local } from '#internal/wcferry/middleware'

export type BotHooksKeys = keyof BotHooks

export type BotHandler<H extends BotHooksKeys> = BotHooks[H]

export interface BotHandlerObject<H extends BotHooksKeys> {
  handler: BotHooks[H]
  hook?: H
  /**
   * 仅在满足条件时执行
   * @default true
   */
  when?: RegExp | boolean | ((payload: Parameters<BotHooks[H]>[0]) => boolean | Promise<boolean>)

  middleware?: BotHandler<H> | string | (string | BotHandler<H>)[]
}

export type BotHandlerOptions<H extends BotHooksKeys> = BotHandler<H> | BotHandlerObject<H>

export function defineBotHandler<H extends BotHooksKeys>(options: BotHandlerOptions<H>) {
  const { handler, hook = 'message' as const, when = true, middleware: __middleware = [] } = typeof options === 'function' ? { handler: options } : options
  const bot = useBot()
  const _middleware = Array.isArray(__middleware) ? __middleware : [__middleware]
  const localMiddleware = _middleware.map((v) => {
    if (typeof v === 'string') {
      return ($local as BotHandlerObject<H>[]).find(v => hook.startsWith(v.hook!))?.handler
    }
    return v
  }).filter(v => v) as BotHandler<H>[]
  const globalMiddleware = ($global as BotHandlerObject<H>[]).filter(v => hook.startsWith(v.hook!)).map(v => v.handler)
  const middleware = [...globalMiddleware, ...localMiddleware]

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  bot.hooks.hook(hook, async (payload) => {
    for (const m of middleware) {
      const result = await m(payload)
      if (result !== undefined) {
        return result
      }
    }
    const text = payload?.payload?.text || payload?.payload?.topic || ''
    const shouldExecute = typeof when === 'function' ? await when(payload) : when === true || (when instanceof RegExp && when.test(text))
    if (shouldExecute) {
      return handler(payload)
    }
  })
  return handler
}
