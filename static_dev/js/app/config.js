angular
    .module('app')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
        .state('search', {
            url: '/',
            controller: 'SearchController as search',
            templateUrl: 'templates/search.html'
        })
        .state('results', {
            url: '/results',
            controller: 'ResultsController as ctrl',
            templateUrl: 'templates/results.html'
        });
        $urlRouterProvider.otherwise('/');
});