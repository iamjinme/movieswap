// Define the app module
var movieswApp = angular.module('movieswApp', ['ngRoute']);
// Define the configuration of app
movieswApp.config(['$locationProvider' ,'$routeProvider',
  function config($locationProvider, $routeProvider) {
    // Define routes
    $routeProvider.
      when('/', {
        templateUrl: '/views/main.html'
      }).
      when('/all', {
        templateUrl: '/views/all.html'
      }).
      otherwise('/');
  }
]);
// Define the main controller on the app module
movieswApp.controller('mainController', function mainController($scope, $http) {
  $scope.times = 0;
  $scope.images = [1, 2, 3, 4, 5, 6, 7, 8];
  $scope.addClick = function() {
    this.times++;
  }
  $scope.resetClick = function() {
    this.times = 0;
  }
});
