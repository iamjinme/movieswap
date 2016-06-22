// Dashboard Controller
movieswApp.controller('myController', function myController($scope, $http, session, rest) {
  $scope.results = [];
  $scope.collection = [];
  $scope.trades = [];
  $scope.trade_in = true;
  // Change trade
  $scope.changeTrade = function(trade_bool) {
    $scope.trade_in = trade_bool;
    $scope.trades = [];
    if ($scope.trade_in) {
      // Trades In
      $('#btn_trade_in').addClass('btn-primary');
      $('#btn_trade_out').removeClass('btn-primary');
      rest.getTradeIn().then(function(data) {
        if (!data.error) {
          $scope.trades = data;
        }
      });
    } else {
      // Trades Out
      $('#btn_trade_out').addClass('btn-primary');
      $('#btn_trade_in').removeClass('btn-primary');
      rest.getTradeOut().then(function(data) {
        if (!data.error) {
          $scope.trades = data;
        }
      });
    }
  }
  // Cancel trade
  $scope.cancelTrade = function(movie, pos) {
    rest.delTrade(movie._id).then(function(data){
      if (!data.error) {
        $scope.trades.splice(pos, 1);
      }
    });
  }
  // Accept trade
  $scope.acceptTrade = function(movie, pos) {
    rest.acceptTrade(movie._id).then(function(data){
      if (!data.error) {
        $scope.trades.splice(pos, 1);
      }
    });
  }
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
        console.log(json.message);
      } else {
        $scope.collection.unshift(json);
        $scope.$apply();
      }
    });
  }
  // Remove movie
  $scope.removeMovie = function(movie) {
    // Position movie
    function thatMovie(element, index) {
      return element._id === movie._id;
    }
    // Call API
    $.ajax({
      url: '/api/movies',
      type: 'DELETE',
      data: movie,
      dataType: 'json'
    }).done(function(json){
      if (json.error) {
        console.log('error');
      } else {
        var pos = $scope.collection.findIndex(thatMovie);
        if (pos) {
          $scope.collection.splice(pos, 1);
          $scope.$apply();
        }
      }
    });
  }
  // Load collection
  $http.get('/api/movies/user')
    .success(function(data) {
      if (!data.error) {
        $scope.collection = data;
      }
    });
});
