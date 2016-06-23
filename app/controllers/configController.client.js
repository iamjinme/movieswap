// Config Controller
movieswApp.controller('configController', function configController($scope, $http, session, rest) {
  $scope.user = Object.assign({}, session.user); // Othercase are linked
  $scope.password = '';
  $scope.new_password = '';
  // Clear buttons
  $('.btn-clear').click(function() {
    $(this).parent().addClass('hide');
  });
  // Save config
  $scope.saveConfig = function() {
    rest.postUser($scope.user).then(function(data) {
      if (!data.error) {
        $('#text_message').html('User profile saved!');
        $('#message').removeClass('hide').removeClass('toast-danger').addClass('toast-primary');
        // TODO: assign properties to session
      } else {
        $('#text_message').html(data.message);
        $('#message').removeClass('hide').removeClass('toast-primary').addClass('toast-danger');
      }
    });
  }
  // Change Password
  $scope.changePassword = function() {
    var password = {
      _id: session.user._id,
      password: $scope.password.hashCode(),
      new_password: $scope.new_password.hashCode()
    }
    rest.postPassword(password).then(function(data) {
      $('#text_message').html(data.message);
      if (!data.error) {
        $('#message').removeClass('hide').removeClass('toast-danger').addClass('toast-primary');
      } else {
        $('#message').removeClass('hide').removeClass('toast-primary').addClass('toast-danger');
      }
    });
  }
});
