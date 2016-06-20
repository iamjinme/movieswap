// All Movies Controller
movieswApp.controller('allController', function allController($scope, $http, session) {
  $scope.logged = session.logged;
  $scope.user_id = $scope.logged ? session.user._id : null;
  $scope.collection = [];
  // On broadcast: LOGIN
  $scope.$on("LOGIN", function() {
    $scope.logged = session.logged;
    $scope.user_id = $scope.logged ? session.user._id : null;
    $scope.$apply();
  });
  // Load Movies
  $http.get('/api/movies')
    .success(function(data) {
      if (!data.error) {
        $scope.collection = data;
      }
    });
});
