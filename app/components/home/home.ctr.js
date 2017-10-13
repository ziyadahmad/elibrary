(function () {
    'use strict';

    angular
        .module('elibrary')
        .controller('homeController', homeController)
        .controller('loginController', loginController)
        .controller('registerController', registerController);

    function homeController($scope, booksService, $mdDialog, $q, $timeout) {
        $scope.querySearch = querySearch;

        function querySearch(query) {
            var results = $scope.books.filter(function (obj) {
                return obj.name.toLowerCase().startsWith(query.toLowerCase()) ? obj : "";
            });

            var deferred = $q.defer();
            $timeout(function () { deferred.resolve(results); }, Math.random() * 1000, false);
            return deferred.promise;
        }

        $scope.color = 'dark-heading-bg';
        $scope.getBooks = function () {
            var profile = localStorage.getItem("Profile");
            $scope.promise = booksService.Books(profile).then(function (response) {
                $scope.books = response;
                $scope.selected = [];
            }).$promise;
        };

        $scope.addBook = function (event) {
            $mdDialog.show({
                controller: AddBookController,
                templateUrl: '/components/books/addbook.dlg.tpl.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function () {
                    $scope.getBooks();
                });
        };

        $scope.getBooks();
    }

    function AddBookController($scope, $mdDialog, booksService, toastService) {
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.promise = booksService.Categories().then(function (response) {
            $scope.Categories = response;
        }).$promise;

        $scope.saveBook = function () {
            if ($scope.addbookForm.$valid) {
                booksService.AddBook($scope.selected).then(function (res) {
                    $scope.hide();
                    toastService.show("Added Successfully!!")
                });
            }
        };
    }

    function loginController($scope, LoginService, toastService, $state) {
        $scope.formData = {};
        $scope.login = function () {
            if (!$scope.loginForm.$invalid) {
                LoginService.Authenticate($scope.formData).then(function (response) {
                    switch (response.STATUS) {
                        case "SUCCESS":
                            localStorage.setItem("isAuthenticated", true);
                            localStorage.setItem("Profile", JSON.stringify(response.Data));
                            $state.go("home");
                            toastService.show("Authenticated Successfully !!");
                            break;
                        case "INVALID_PASSWORD":
                            localStorage.setItem("isAuthenticated", false);
                            toastService.show("Password entered is invalid. Please try again !!");
                            break;
                        case "NOT_FOUND":
                            localStorage.setItem("isAuthenticated", false);
                            toastService.show("Username entered could not be found !!");
                            break;
                    }
                });
            }
        }
    }

    function registerController($scope, LoginService, toastService, $state) {
        $scope.formData = {};
        $scope.registerUser = function () {
            if (!$scope.registerForm.$invalid) {
                LoginService.Register($scope.formData).then(function (response) {
                    switch (response.STATUS) {
                        case "SUCCESS":
                            localStorage.setItem("isAuthenticated", true);
                            toastService.show("Registered successfully !! ID: " + response.Data);
                            $state.go("login");
                            break;
                        case "EXISTS":
                            localStorage.setItem("isAuthenticated", false);
                            toastService.show("User Already exists");
                            break;
                    }
                });
            }
        }
    }
})();