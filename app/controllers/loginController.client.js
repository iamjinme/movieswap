// Login Controller
movieswApp.controller('loginController', function loginController($scope, $http, session) {
  $scope.user = {};
  $scope.login = {
    in: false,
    is_login: true,
    title: '',
    subtitle: '',
    message: '',
    error: false
  };
  // Clear buttons
  $('.btn-clear').click(function() {
    var modal = $(this).data('modal');
    if (modal) {
      $(modal).removeClass('active');
    } else {
      $(this).parent().addClass('hide');
    }
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
  // Close button modal
  $('#modal_close').click(function() {
    $('#login_modal').removeClass('active');
  });
  // SignUp/Login Form submit
  $('#btn_submit')
  .click(function() {
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
        session.set('user', json);
        $scope.user = session.user;
        $('.modal').removeClass('active');
        $scope.$apply();
        // Add broadcast for future changes
        $scope.$broadcast("LOGIN");
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
        session.remove();
        $scope.user = session.user;
        window.location.href = '/';
      }
    });
  });
  // User have session?
  $http.get('/api/login')
    .success(function(data) {
      if (data.error) {
        session.set('user', {});
        $scope.user = session.user;
        $scope.login.in = false;
      } else {
        session.set('user', data);
        $scope.user = session.user;
        $scope.login.in = true;
      }
    });
});
