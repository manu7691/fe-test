angular
    .module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        // Route Configuration
        $stateProvider
        .state('search', {
            url: '/',
            controller: 'SearchController as search',
            templateUrl: 'templates/search.html'
        })
        .state('results', {
            url: '/flights/from/:origin/to/:destination/:departure_date/:return_date/',
            controller: 'ResultsController as ctrl',
            templateUrl: 'templates/results.html'
        });
        $urlRouterProvider.otherwise('/');
});