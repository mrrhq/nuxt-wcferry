import { FerryAgent } from 'wechaty-puppet-ferry'
import { useBotApi } from './useBotApi'

let agent: FerryAgent

export function useBotAgent() {
  const api = useBotApi()
  if (!agent) {
    agent = new FerryAgent({
      server: {
        disabled: true,
      },
      api,
    })
  }

  return agent
}
