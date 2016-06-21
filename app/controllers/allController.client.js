// All Movies Controller
movieswApp.controller('allController', function allController($scope, $http, session) {
  $scope.logged = session.logged;
  $scope.user_id = $scope.logged ? session.user._id : null;
  $scope.movies = [];
  // On broadcast: LOGIN
  $scope.$on("LOGIN", function() {
    $scope.logged = session.logged;
    $scope.user_id = $scope.logged ? session.user._id : null;
    $scope.$apply();
    console.log('on', 'login');
  });
  // Search ip
  var ipInLikes = function(id, ip) {
    for(var i in $scope.movies) {
      if ($scope.movies[i]._id === id) {
        var pos = $scope.movies[i].likes.indexOf(ip);
        if (pos >= 0) {
          $scope.movies[i].likes.splice(pos, 1);
        } else {
          $scope.movies[i].likes.push(ip);
        }
        break;
      }
    }
  }
  // I like it
  $scope.setLike = function(movie) {
    $http.get('/api/likes/' + movie)
      .success(function(data) {
        if (!data.error) {
          ipInLikes(data.id, data.ip);
        }
      });
  }
  // Load Movies
  $http.get('/api/movies')
    .success(function(data) {
      if (!data.error) {
        $scope.movies = data;
      }
    });
});