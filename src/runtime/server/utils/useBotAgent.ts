import { AgentWcferry } from 'wechaty-puppet-wcferry'

let agent: AgentWcferry

export function useBotAgent() {
  if (!agent) {
    agent = new AgentWcferry()
  }

  return agent
}
