var app = angular.module('elibrary',
    ['ngMaterial', 'ui.router', 'ngMessages', 'ngMdIcons','md.data.table']);

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
        }).state('settings', {
            url: '/settings',
            templateUrl: 'components/settings/settings.tpl.html',
            controller: 'settingsController'
        });

    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
    $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
    $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
    $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});
