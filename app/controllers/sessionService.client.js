// Session Service
movieswApp.factory('session', function(){
  var session = {};
  session.user = {};
  session.logged = false;

  session.set = function(name, value) {
    session[name] = value;
  };

  session.remove = function() {
    session.user = {};
  }

  return session;
});
