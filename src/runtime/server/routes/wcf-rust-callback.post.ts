export default defineEventHandler(async (event) => {
  const { ferry } = useNitroApp()
  const msg = await readBody(event)
  ferry.puppet.agent.emit('message', msg)
})
