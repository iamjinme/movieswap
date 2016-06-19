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
        templateUrl: '/views/all.html'
      }).
      when('/my', {
        templateUrl: '/views/my.html'
      }).
      otherwise('/');
  }
]);
// Define the main controller on the app module
movieswApp.controller('mainController', function mainController($scope, $http, session) {
  $scope.times = 0;
  $scope.images = [1, 2, 3, 4, 5, 6, 7, 8];
  $scope.results = [];
  // Clear buttons
  $('.btn-clear').click(function() {
    var modal = $(this).data('modal');
    if (modal) {
      $(modal).removeClass('active');
    } else {
      $(this).parent().addClass('hide');
    }
  });
  // Search movies
  $scope.getSearch = function() {
    $('#btn_search').addClass('loading');
    if (this.search) {
      $http.get('/api/search/' + this.search)
        .success(function(data) {
          if (data.length) {
            $scope.results = data;
          }
          $('#btn_search').removeClass('loading');
        });
    }
  }
  // Add movie
  $scope.addMovie = function(movie) {
    $.ajax({
      url: '/api/movies',
      type: 'POST',
      data: movie,
      dataType: 'json'
    }).done(function(json){
      if (json.error) {
        console.log('error');
      } else {
        console.log('added');
      }
    });
  }
  $scope.addClick = function() {
    $scope.times++;
  }
  $scope.resetClick = function() {
    $scope.times = 0;
  }
});
