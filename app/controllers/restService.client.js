// REST Service
movieswApp.factory('rest', function($http){
  var rest = {};

  rest.getAllMovies = function(name, value) {
    // Load Movies
    var promise = $http.get('/api/movies')
      .then(function(response) {
        console.log(response);
        return response.data;
      });
    return promise;
  };

  return rest;
});
