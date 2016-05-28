function SearchController($scope,$state,$filter,$timeout,dataFactory) {
    var self = $scope;
    self.error = null;
    self.selected_origin = null;
    self.selected_destination = null;
    self.destinations = [];
    self.oldOrigin = null;
    self.date_now = moment().format('YYYY-MM-DD');
    self.departure_date = null;
    self.return_date = null;

    getAirports();

    // Load airports from API
    function getAirports(){
        dataFactory
            .getAirports()
            .then(function (response) {
                self.countries = response.data['airports'];
                self.routes = response.data['routes'];
                self.messages = response.data['messages'];
            }, function (error) {
                self.error = error.message;
            });
    }

    // show results view
    function lookforCheapestFlights(){

        $state.go('results',{
            origin:self.selected_origin.description.iataCode,
            destination:self.selected_destination.description.iataCode,
            departure_date: moment(new Date(self.departure_date)).format('YYYY-MM-DD'),
            return_date: moment(new Date(self.return_date)).format('YYYY-MM-DD')
        },{ location:'replace' });

    }

    // Load and filter available destinations for origin airport
    self.selectOrigin = function(selected) {

        if (typeof selected != "undefined") {
            if (self.oldOrigin != selected && self.selected_destination != null)
                $scope.$broadcast('angucomplete-alt:clearInput', 'destination');

            self.selected_origin = selected;

            var filter_by_route = self.selected_origin.description.iataCode;
            self.routes_availables_destination = self.routes[filter_by_route];
            self.destinations = [];
            // Destinations are filtered
            for(var i = 0; i<self.routes_availables_destination.length;i++){
                for(var j = 0;j<self.countries.length;j++){
                    if(self.countries[j].iataCode == self.routes_availables_destination[i]){
                        self.destinations.push(self.countries[j]);
                    }
                }
            }
        }else{
            self.destinations = [];
            self.$broadcast('angucomplete-alt:clearInput', 'destination');
            self.selected_destination = null;
        }
    };

    // Set destination airport
    self.selectDestination = function(selected) {
        if (typeof selected != "undefined") {
            self.selected_destination = selected;
        }
    };

    // Validators for dates
    self.$watch('departure_date', function (value) {
        var liveDate;

        try {
            liveDate = new Date(value);
        } catch(e) {}

        if (!liveDate) {
            self.error = "This is not a valid date";
            self.clearError();
        } else {
            self.error = null;

            if(self.return_date != null && (new Date(self.return_date) < new Date(self.departure_date))){
                    self.return_date = null;
                    self.error = "Return date can't be bigger than departure date";
                    self.clearError();
            }else{
                self.error = null;

            }
        }
    });
    self.$watch('return_date', function () {
        if(new Date(self.departure_date) < new Date(self.return_date))
            self.error = null;
    });

    // Disable search button until each field is completed
    self.disableSearchButton = function(){
        return (self.departure_date == null || self.return_date == null || self.selected_origin == null
            || self.selected_destination == null || self.error != null);
    };

    // Redirect to results view
    self.lookForFlights = function(){
        if(self.disableSearchButton())
            return;
        lookforCheapestFlights();
    };

    // Timeout to show any error
    self.clearError = function(){
        $timeout(function() {
            self.error = null;
        }, 10000);
    }
}

angular
    .module('app')
    .controller('SearchController', SearchController);