export default defineBotCommandEventHandler({
  command: 'ping',
  handler({ message }) {
    message.say('ping')
  },
})
