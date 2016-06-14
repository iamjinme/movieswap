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
      otherwise('/');
  }
]);
// Define the main controller on the app module
movieswApp.controller('mainController', function mainController($scope, $http) {
  $scope.object = "movies";
});
