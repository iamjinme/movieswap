// REST Service
movieswApp.factory('rest', function($http){
  var rest = {};

  // GET All Movies
  rest.getAllMovies = function() {
    var promise = $http.get('/api/movies')
      .then(function(response) {
        return response.data;
      });
    return promise;
  };

  // PUT Trade Movie
  rest.putTrade = function(movie) {
    var promise = $http.put('/api/trades/add/' + movie)
      .then(function(response) {
        return response.data;
      });
    return promise;
  }

  // PUT Like Movie
  rest.putLike = function(movie) {
    var promise = $http.put('/api/likes/' + movie)
      .then(function(response) {
        console.log(response);
        return response.data;
      });
    return promise;
  }

  return rest;
});
