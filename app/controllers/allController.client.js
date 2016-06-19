// All Movies Controller
movieswApp.controller('allController', function allController($scope, $http, session) {
  $scope.logged = session.logged;
  console.log(session.user.hasOwnProperty('_id'), session);
  $scope.collection = [];
  // Load Movies
  $http.get('/api/movies')
    .success(function(data) {
      if (!data.error) {
        $scope.collection = data;
      }
    });
});
