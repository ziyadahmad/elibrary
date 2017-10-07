var app = angular.module('elibrary',
    ['ngMaterial', 'ui.router','ngMessages','ngMdIcons']);


app.config(function ($urlRouterProvider, $stateProvider,$mdThemingProvider) {

    $urlRouterProvider.otherwise('home');

    $stateProvider        
        .state('home', {
            url: '/',
            templateUrl: "components/home/home.tpl.html",
            controller:"homeController"            
        }).state('login', {
            url: '/login',
            templateUrl: 'components/login/login.tpl.html',
            controller: 'loginController'            
        }).state('register', {
            url: '/register',
            templateUrl: 'components/login/register.tpl.html',
            controller: 'registerController'
        })
        
    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
    $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
    $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
    $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});
