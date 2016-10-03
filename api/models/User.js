/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');
module.exports = {

  attributes: {
    name: {type: 'string', required: true},
    email: {type: 'string', required: true, unique: true},
    password: {type: 'string', required: true},
  },
  beforeCreate: function(user, next){
    var password = User.hashPasswordWithSalt(user.password);
    user.password = password;
    next();
  },
  hashPasswordWithSalt: function(password) {
    genSalt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, genSalt);
    return password;
  }
};
