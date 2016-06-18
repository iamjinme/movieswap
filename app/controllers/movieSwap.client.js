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
      when('/my', {
        templateUrl: '/views/my.html'
      }).
      otherwise('/');
  }
]);
// Define the main controller on the app module
movieswApp.controller('mainController', function mainController($scope, $http) {
  $scope.times = 0;
  $scope.user = {};
  $scope.login = {
    in: false,
    is_login: true,
    title: '',
    subtitle: '',
    message: '',
    error: false
  };
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
  // Close button modal
  $('#modal_close').click(function() {
    $('#login_modal').removeClass('active');
  });
  // Login button (navbar)
  $('#btn_login').click(function() {
    $scope.login.message = '';
    $scope.login.error = false;
    $scope.login.is_login = true;
    $scope.login.title = 'Login';
    $scope.login.subtitle = 'Sign Up';
    $('.modal').addClass('active');
    $scope.$apply();
  });
  // Sign Up button (navbar)
  $('#btn_signup').click(function() {
    $scope.login.message = '';
    $scope.login.error = false;
    $scope.login.is_login = false;
    $scope.login.title = 'Sign Up';
    $scope.login.subtitle = 'Login';
    $('.modal').addClass('active');
    $scope.$apply();
  });
  // SignUp/Login Form submit
  $('#btn_submit')
  .click(function() {
    console.log('submit');
    if ($scope.login.is_login) {
      var url = '/api/login';
    } else {
      var url = '/api/signup';
    }
    var data = {
      'name': $('input[name=name]').val(),
      'email': $('input[name=email]').val(),
      'password': $('input[name=password]').val().hashCode()
    }
    $.ajax({
      url: url,
      type: 'POST',
      data: data,
      dataType: 'json'
    }).done(function(json){
      if (json.error) {
        $scope.login.error = true;
        $scope.login.message = json.message;
        $('#login_message').removeClass('hide');
        $scope.$apply();
      } else {
        $scope.login.in = true;
        $scope.user = json;
        $('.modal').removeClass('active');
        $scope.$apply();
      }
    });
  });
  // Logout
  $('#btn_logout').click(function() {
    $.ajax({
      url: '/api/logout',
      type: 'GET'
    }).done(function(json){
      if (json.logout) {
        $scope.login.in = false;
        $scope.user = {};
        window.location.href = '/';
      }
    });
  });
  // Search movies
  $scope.getSearch = function() {
    $('#btn_search').addClass('loading');
    if (this.search) {
      $http.get('/api/search/' + this.search)
        .success(function(data) {
          if (data.length) {
            $scope.results = data;
            console.log(data);
          }
          $('#btn_search').removeClass('loading');
        });
    }
  }
  $scope.addClick = function() {
    $scope.times++;
  }
  $scope.resetClick = function() {
    $scope.times = 0;
  }
  // User have session?
  $http.get('/api/login')
    .success(function(data) {
      if (!data.error) {
        $scope.user = data;
        $scope.login.in = true;
      }
    });
});
