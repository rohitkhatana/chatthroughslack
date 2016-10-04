/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var RtmClient = require('@slack/client').RtmClient;

module.exports = {
	send: function(req, res) {
		if (!req.isSocket) {return res.badRequest();}
		User.findOne({id: req.param('sender')}).exec(function(err, sender){
			var RTM_CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS.RTM;
			var rtm = new RtmClient(sender.slackInfo.token);
			rtm.start();
			rtm.on(RTM_CLIENT_EVENTS.RTM_CONNECTION_OPENED, function () {
				rtm.sendMessage(req.param('msg'), req.param('channelId'), function msgSent(){
				})
			})
			Channel.findOne({slackChannelId: req.param('channelId')}).exec(function(err, channel){
				if(channel) {
					if (channel.createdBy == req.param('sender')) {
						var sender = channel.createdBy;
						var receiver = channel.member;
					} else {
						var sender = channel.member;
						var receiver = channel.createdBy;
					}
					Message.create({sender: sender, receiver: receiver, channel: channel.id, msg: req.param('msg')}).exec(function(err, msg) {
						Message.publishCreate({id: msg.id, msg: req.param('msg'), sender: msg.sender, senderName: sender.name, channel: channel.slackChannelId});
					});
				}
			});
			return res.send({msg: "ok"})
		})

	},
	subscribe: function(req, res) {
		if(!req.isSocket) {return res.badRequest();}
		Message.watch(req);
	}
};
