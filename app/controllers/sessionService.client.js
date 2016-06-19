// Session Service
movieswApp.factory('session', function(){
  var session = {};
  session.user = {};
  session.logged = false;

  session.set = function(name, value) {
    session[name] = value;
    session.logged = session.user.hasOwnProperty('_id');
  };

  session.remove = function() {
    session.user = {};
    session.logged = false;
  }

  return session;
});
