module.exports = {
  incoming: function(req, res) {
    console.log('--bot--called--')
    res.ok(req.param('challenge'));
  }
}
