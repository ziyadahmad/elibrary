(function () {
    'use strict';

    angular
        .module('elibrary')
        .controller('homeController', homeController)
        .controller('loginController', loginController)
        .controller('registerController', registerController);

    function homeController($scope) {
        var vm = this;
    }

    function loginController($scope, LoginService, toastService,$rootScope,$state) {
        $scope.formData = {};
        $scope.login = function () {
            if (!$scope.loginForm.$invalid) {
                LoginService.Authenticate($scope.formData).then(function (response) {
                    switch (response.STATUS) {
                        case "SUCCESS":
                            $rootScope.IsAuthenticated = true;
                            $state.go("home");
                            toastService.show("Authenticated Successfully !!");
                            break;
                        case "INVALID_PASSWORD":
                            $rootScope.IsAuthenticated = false;                            
                            toastService.show("Password entered is invalid. Please try again !!");
                            break;
                        case "NOT_FOUND":
                            $rootScope.IsAuthenticated = false;
                            toastService.show("Username entered could not be found !!");
                            break;
                    }
                });
            }
        }
    }

    function registerController($scope, LoginService) {
        $scope.formData = {};
        $scope.registerUser = function () {
            if (!$scope.registerForm.$invalid) {
                LoginService.Register($scope.formData);
            }
        }
    }
})();