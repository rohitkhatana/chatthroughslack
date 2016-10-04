module.exports = {
  attributes: {
    slackChannelId: {type: 'string', required: true},
    createdBy: {model: 'User'},
    member: {model: 'User'},
    name: {type: 'string', required: true},
    messages: {
      collection: 'message',
      via: 'channel'
    }
  }
}
