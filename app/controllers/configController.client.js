// Config Controller
movieswApp.controller('configController', function configController($scope, $http, session, rest) {
  $scope.user = session.user;
  $scope.saveConfig = function() {
    console.log($scope.user);
  }
});
