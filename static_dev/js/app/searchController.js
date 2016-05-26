function SearchController($scope,$http) {
    var self = $scope;
    self.error = null;

    $http.get('//murmuring-ocean-10826.herokuapp.com/en/api/2/forms/flight-booking-selector',{ cache: true}).then(function(response) {
        self.countries = response.data['airports'];
        self.routes = response.data['routes'];
        self.messages = response.data['messages'];
    });

    self.selected_origin = null;
    self.selected_destination = null;
    self.destinations = [];
    self.oldOrigin = null;
    self.selectOrigin = function(selected) {

        console.log(selected);
        if (typeof selected != "undefined") {
            if (self.oldOrigin != selected)
                $scope.$broadcast('angucomplete-alt:clearInput', 'destination');

            self.selected_origin = selected;

            var filter_by_route = self.selected_origin.description.iataCode;
            self.routes_availables_destination = self.routes[filter_by_route];
            self.destinations = [];
            // Destinations are filtered to improve user experience
            for(var i = 0; i<self.routes_availables_destination.length;i++){
                for(var j = 0;j<self.countries.length;j++){
                    if(self.countries[j].iataCode == self.routes_availables_destination[i]){
                        self.destinations.push(self.countries[j]);
                    }
                }
            }
        }else{
            self.destinations = [];
            self.selected_destination = null;
        }
    };


    self.selectDestination = function(selected) {
        console.log("there");
        if (typeof selected != "undefined") {
            self.selected_destination = selected;
        }
    };

    self.date_now = new Date();

    self.departure_date = null;
    self.return_date = null;


    self.$watch('departure_date', function (value) {
        var liveDate;

        try {
            liveDate = new Date(value);
        } catch(e) {}

        if (!liveDate) {
            self.error = "This is not a valid date";
        } else {
            self.error = null;

            if(self.return_date != null && (new Date(self.return_date) < new Date(self.departure_date))){
                    self.return_date = null;
                    self.error = "Return date can't be bigger than departure date";
            }else{
                self.error = null;
            }
        }
    });

    self.$watch('return_date', function (value) {
        if(new Date(self.departure_date) < new Date(self.return_date))
            self.error = null;
    });

    self.disableSearchButton = function(){

        if(self.departure_date == null || self.return_date == null || self.selected_origin == null
            || self.selected_destination == null || self.error != null){
            return true;
        }
        return false;
    }

    self.lookForFlights = function(){
        $http.get('https://murmuring-ocean-10826.herokuapp.com/en/api/2/flights/from/'+self.selected_origin.
            description.iataCode+'/to/'+self.selected_destination.description.iataCode+'/' +
        self.departure_date+'/'+self.return_date+'/250/unique/?limit=15&offset-0').then(function(response) {
           self.flights = response.data;
        });
    }


}

angular
    .module('app')
    .controller('SearchController', SearchController);