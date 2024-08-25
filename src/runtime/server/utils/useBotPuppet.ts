import { PuppetFerry } from 'wechaty-puppet-ferry'
import { useBotAgent } from './useBotAgent'

let puppet: PuppetFerry

export function useBotPuppet() {
  const agent = useBotAgent()
  if (!puppet) {
    puppet = new PuppetFerry({ agent })
  }

  return puppet
}
