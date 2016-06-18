// Session Service
movieswApp.factory('session', function(){
  var session = {};

  session.setUser = function(user) {
    session.user = user;
  };

  return session;

});
