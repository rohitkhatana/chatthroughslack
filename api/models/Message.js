module.exports = {
  attributes: {
    sender: {
      model: 'User'
    },
    receiver: {
      model: 'User'
    },
    channel: {
      model: 'channel'
    },
    msg: {type: 'string'},
    ts: {type: 'string'}
  }
}
