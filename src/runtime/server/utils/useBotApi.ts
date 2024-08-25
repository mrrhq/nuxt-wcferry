import { WcfRustApi } from 'wechaty-puppet-ferry'

let api: WcfRustApi

export function useBotApi() {
  const { ferry: ferryConfig } = useRuntimeConfig()
  if (!api) {
    api = new WcfRustApi({
      baseURL: ferryConfig?.baseURL,
    })
  }

  return api
}
