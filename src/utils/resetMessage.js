import message from 'ant-design-vue/es/message'
let messageInstance = null
const resetMessage = options => {
  if (messageInstance) {
    message.destroy()
  }
  messageInstance = message[options.type](options.message)
}
;['error', 'success', 'info', 'warning'].forEach(type => {
  resetMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return resetMessage(options)
  }
})
export const messages = resetMessage
