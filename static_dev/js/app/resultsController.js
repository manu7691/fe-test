function ResultsController($scope,$state,$location,dataFactory) {
    var self = $scope;
    self.origin = $state.params.origin;
    self.destination = $state.params.destination;
    self.departure_date = $state.params.departure_date;
    self.return_date = $state.params.return_date;
    self.loaded = false;
    getFlightsResults();

    // Get cheapest flights from API - factory
    function getFlightsResults(){
        var data = {
            origin: self.origin,
            destination:  self.destination,
            departure_date: self.departure_date,
            return_date: self.return_date
        };

        dataFactory
            .getCheapestFlights(data)
            .then(function (response) {
                self.flights = response.data['flights'];
                self.loaded = true;
            }, function (error) {
                self.error = error.message;
                self.loaded = true;
            });
    }

    // Remove any chance to go back to the search,
    // so the only way is to search from new search button
    self.$on('$viewContentLoaded', function(){
        $location.replace(); //clear last history route
    });

}

angular
    .module('app')
    .controller('ResultsController', ResultsController);