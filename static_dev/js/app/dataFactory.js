function DataFactory($http){

    // Factory to load data from Flights API
    // - Airports and routes
    // - Cheapest flights

    var baseAPI = '//murmuring-ocean-10826.herokuapp.com/en/api/2/';

    function getAirports() {
        return $http
            .get(baseAPI+'forms/flight-booking-selector',{ cache: true})
            .then(function(response) {
                return response;
        },function(error){
            return error;
        });
    }

    function getCheapestFlights(data){
        return $http
            .get(baseAPI+'flights/from/'+ data.origin + '/to/' + data.destination
            + '/' + data.departure_date + '/' + data.return_date + '/250/unique/')
            .then(function(response) {
                return response;
        },function(error){
            return error;
        });
    }

    return {
        getAirports: getAirports,
        getCheapestFlights: getCheapestFlights
    };

}

angular
    .module('app')
    .factory('dataFactory',DataFactory);
