var app = angular.module('elibrary',
    ['ngMaterial', 'ui.router', 'ngMessages', 'ngMdIcons', 'md.data.table']);

app.config(function ($urlRouterProvider, $stateProvider, $mdThemingProvider) {

    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: "components/home/home.tpl.html",
            controller: "homeController"
        }).state('login', {
            url: '/login',
            templateUrl: 'components/login/login.tpl.html',
            controller: 'loginController'
        }).state('register', {
            url: '/register',
            templateUrl: 'components/login/register.tpl.html',
            controller: 'registerController'
        }).state('users', {
            url: '/users',
            templateUrl: 'components/users/users.tpl.html',
            controller: 'usersController'
        }).state('books', {
            url: '/books',
            templateUrl: 'components/books/books.tpl.html',
            controller: 'booksController'
        });

    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
    $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
    $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
    $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});

app.run(function ($rootScope, $location) {
    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        $rootScope.isAuthenticated = localStorage.getItem("isAuthenticated");
        $rootScope.Profile = JSON.parse(localStorage.getItem("Profile"));
    });    
});

