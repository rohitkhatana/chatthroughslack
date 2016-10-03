/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');
module.exports = {
	register: function(req, res) {
		return res.view({err: {}});
	},

	create: function(req, res) {
		User.create(req.allParams()).exec(function(err, user){
			if(err) {
				console.log(err);
				return res.view('user/register', {err: {message: "Email already taken"}});
			}
			return res.view('user/index');
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
              html: function(){ res.view(503, 'landing.ejs');}
            });
          }
          if(req.wantsJSON){
            res.json({error: false, user: user});
          }
          else{
            res.redirect('user/index');
          }
        });
      }
    })(req, res);
  },

	login: function(req, res) {
		return res.view('user/login', {err: {}});
	}
};
