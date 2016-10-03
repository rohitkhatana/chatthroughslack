/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');
var request = require('request');
// var slack = require('slack');
module.exports = {
	register: function(req, res) {
		return res.view({err: {}});
	},

	index: function(req, res) {
		User.find().exec(function(err, users){
			return res.view({err: err, users: users});
		});
	},

	connect: function(req, res) {
		console.log(req.allParams());
		User.findOne({id: req.param('userId')}).exec(function(err, user) {
			if(err) {
				return res.redirect('user');
			} else {
				if (user.friends && user.friends.includes(req.user.id)) {
					console.log('api cll skipped');
					return res.redirect('chat/' + user.id);
				} else {
					// user.addFriend(req.user.id)
					// req.user.addFriend(user.id)
					var webClient = require('@slack/client').WebClient;
					var wc = new webClient(req.user.slackInfo.token);
					wc.channels.join(user.name, function(err, info) {
						if(info.ok == true) {
							var wc = new webClient(user.slackInfo.token);
							wc.channels.join(user.name)
						}
						return res.redirect('chat/' + user.id);
					});
				}
			}
		});
	},

	chat: function(req, res) {
		return res.view();
	},

	create: function(req, res) {
		User.create(req.allParams()).exec(function(err, user) {
			if(err) {
				console.log(err);
				return res.view('user/register', {err: {message: "Email already taken"}});
			} else {
				passport.authenticate('local', function(err, user, info) {
          if(err || (!user) ) {
            return res.format({
              json: function(){ res.json( 400, {error: true, msg: 'invalid signup request' }); },
              html: function(){ res.view('user/login', {err: info})}
            });
          }
          else{
            req.logIn(user, function(err){
              if(err){
                return res.format({
                  json: function(){ res.json(503, {error: true, msg: 'Something very weird happened.'}) },
                  html: function(){ 'user/login', {err: info} }
                });
              }
							return res.redirect('user');
            });
          }
        })(req, res);
			}
		});
	},

	process: function(req, res){

    passport.authenticate('local', function(err, user, info){
      if(err || (!user) ){
        res.format({
          json: function(){res.json(401, {error: true, msg: 'invalid login details'})},
          html: function(){res.view('user/login', {err: info})}
        });
      }
      else{
        req.logIn(user, function(err){
          if(err){
            res.format({
              json: function(){ res.json(503, {error: true, msg: 'Something very wierd happened'}) },
              html: function(){ res.view('user/login', {err: info});}
            });
          }
          if(req.wantsJSON){
            res.json({error: false, user: user});
          }
          else{
            res.redirect('user');
          }
        });
      }
    })(req, res);
  },

	login: function(req, res) {
		return res.view('user/login', {err: {}});
	},

	slack: function(req, res) {

		slack_auth = {client_id: '86496927043.86497181619', client_secret: '8a7a14fe9edb8fb60418b2182e19f5ac', code: req.param('code')}
		request({url: 'https://slack.com/api/oauth.access', qs: slack_auth}, function(err, response, body) {
			console.log(err);
			slackInfo = JSON.parse(body)
			console.log(body);
			if(err || slackInfo.ok == false) {
				console.log(err); return res.redirect('user');
			} else {
				userSlackInfo = {token: slackInfo.access_token, userId: slackInfo.user_id}
				User.update({email: req.user.email}, {slackInfo: userSlackInfo}).exec(function(err, user){
					if (err){console.log(err)}
					return res.redirect('user');
				});
			}
		});
	}
};
