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
    console.log('change-password');
  }
});
