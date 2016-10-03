module.exports = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  else
  {
    return res.format({
      html: function(){
        res.redirect("/login");
      },
    });
  }
};
