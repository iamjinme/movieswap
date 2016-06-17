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
  $scope.login = {
    in: false,
    is_login: true,
    title: '',
    subtitle: '',
    message: '',
    error: false
  };
  $scope.images = [1, 2, 3, 4, 5, 6, 7, 8];
  // Clear buttons
  $('.btn-clear').click(function() {
    var modal = $(this).data('modal');
    if (modal) {
      $(modal).removeClass('active');
    } else {
      $(this).parent().addClass('hide');
    }
  });
  // Close button modal
  $('#modal_close').click(function() {
    $('#login').removeClass('active');
  });
  // Login button (navbar)
  $('#btn_login').click(function() {
    $scope.login.is_login = true;
    $scope.login.title = 'Login';
    $scope.login.subtitle = 'Sign Up';
    $('.modal').addClass('active');
    $scope.$apply();
  });
  // Sign Up button (navbar)
  $('#btn_signup').click(function() {
    $scope.login.is_login = false;
    $scope.login.title = 'Sign Up';
    $scope.login.subtitle = 'Login';
    $('.modal').addClass('active');
    $scope.$apply();
  });
  $scope.addClick = function() {
    $scope.times++;
  }
  $scope.resetClick = function() {
    $scope.times = 0;
  }
});
