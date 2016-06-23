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
    // Position movie
    function thatMovie(element, index) {
      return element._id === movie._id;
    }
    // Call API
    rest.acceptTrade(movie._id).then(function(data){
      if (!data.error) {
        $scope.trades.splice(pos, 1);
        pos = $scope.collection.findIndex(thatMovie);
        if (pos >= 0) {
          $scope.collection.splice(pos, 1);
        }
      }
    });
  }
  // Search movies
  $scope.getSearch = function() {
    if ($scope.search) {
      $('#btn_search').addClass('loading');
      rest.getSearch($scope.search).then(function(data) {
        if (data.length) {
          $scope.results = data;
        }
        $('#btn_search').removeClass('loading');
      })
    }
  }
  // Add movie
  $scope.addMovie = function(movie) {
    // Position movie
    function thatMovie(element, index) {
      return element._id === movie._id;
    }
    // Call API
    rest.postMovie(movie).then(function(data) {
      if (data.error) {
        console.log(data.message);
      } else {
        movie = data;
        var pos = $scope.collection.findIndex(thatMovie);
        if (pos < 0) {
          $scope.collection.unshift(movie);
        }
      }
    })
  }
  // Remove movie
  $scope.removeMovie = function(movie, pos) {
    // Call API
    rest.delMovie(movie._id).then(function(data) {
      if (data.error) {
        console.log(data.message);
      } else {
        $scope.collection.splice(pos, 1);
      }
    })
  }
  // Load collection
  rest.getUserMovies().then(function(data) {
    if (!data.error) {
      $scope.collection = data;
    }
  });
});
