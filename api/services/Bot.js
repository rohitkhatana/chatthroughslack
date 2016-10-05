module.exports = {
  listenForMsg: function(user) {
    if(!user.isConnected) {
      console.log(user)
      var RtmClient = require('@slack/client').RtmClient;
      var rtm = new RtmClient(user.slackInfo.token);
      console.log('---connecting---');
  		rtm.start();
      user.isConnected = true;
      user.save(console.log);
  		var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
  		rtm.on(RTM_EVENTS.MESSAGE, function (message) {
    		// Listens to all `message` events from the team
        console.log(message)
        if (message.type == 'message'){
          Channel.findOne({slackChannelId: message.channel}).populate('createdBy').populate('member').exec(function(err, channel) {
            if(channel) {
              if(channel.createdBy.slackInfo.userId == message.user) {
                var sender = channel.createdBy;
                var receiver = channel.member;
              } else {
                var sender = channel.member;
                var receiver = channel.createdBy;
              }
              console.log(sender)
              console.log("----receiver--")
              console.log(receiver)
              Message.create({channel: channel, sender: sender, receiver: receiver, msg: message.text, ts: message.ts}).exec(function(err, msg) {
                if(msg) {
                  Message.publishCreate({id: msg.id, msg: msg.msg, sender: msg.sender, channel: channel.slackChannelId});
                }
              });
            }
          });
        }
  		});
    }
  }
}
