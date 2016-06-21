// Define the app module
var movieswApp = angular.module('movieswApp', ['ngRoute']);
// Define the configuration of app
movieswApp.config(['$locationProvider' ,'$routeProvider',
  function config($locationProvider, $routeProvider) {
    // Define routes
    $routeProvider.
      when('/', {
        templateUrl: '/views/main.html',
        controller : 'mainController'
      }).
      when('/all', {
        templateUrl: '/views/all.html',
        controller : 'allController'
      }).
      when('/my', {
        templateUrl: '/views/my.html',
        controller : 'myController',
        resolve: {
          "check":function(session, $location) {
            if (!session.logged) {
              $location.path('/');
            }
          }
        }
      }).
      otherwise('/');
  }
]);
// Define the main controller on the app module
movieswApp.controller('mainController', function mainController($scope, $http, session) {
  $scope.times = 0;
  $scope.addClick = function() {
    $scope.times++;
  }
  $scope.resetClick = function() {
    $scope.times = 0;
  }
});
