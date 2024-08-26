import { PuppetWcferry } from 'wechaty-puppet-wcferry'
import { useBotAgent } from './useBotAgent'

let puppet: PuppetWcferry

export function useBotPuppet() {
  const agent = useBotAgent()
  if (!puppet) {
    puppet = new PuppetWcferry({ agent })
  }

  return puppet
}
