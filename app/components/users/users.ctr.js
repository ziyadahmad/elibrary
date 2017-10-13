(function () {
  'use strict';

  angular
    .module('elibrary')
    .controller('usersController', usersController);

  function usersController($scope, usersService, $mdDialog, toastService) {
    $scope.selected = [];

    $scope.query = {
      order: 'userID',
      limit: 5,
      page: 1
    };

    $scope.getUsers = function () {
      $scope.promise = usersService.Users().then(function (response) {
        $scope.users = response;
        $scope.selected = [];
      }).$promise;
    };

    $scope.addItem = function (event) {
      $mdDialog.show({
        controller: AddUserController,
        templateUrl: '/components/users/adduser.dlg.tpl.html',
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
        .then(function () {
          $scope.getUsers();
        });
    };

    $scope.deleteItem = function (event) {
      var userText = "user";
      if ($scope.selected.length > 1) { userText = "users"; }

      var confirm = $mdDialog.confirm()
        .title('Are you sure you want to deactivate selected ' + userText + '?')
        .targetEvent(event)
        .ok('Delete')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function () {
        $scope.selected.forEach(function (element) {
          usersService.deleteUser(element._id).then(function (res) {
            toastService.show(res.MESSAGE);
            $scope.getUsers();
          });
        }, this);
      }, function () {
        $scope.selected = [];
      });
    }

    $scope.editItem = function (event) {
      $mdDialog.show({
        controller: EditUserController,
        templateUrl: '/components/users/edituser.dlg.tpl.html',
        locals: {
          selected: $scope.selected
        },
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
        .then(function () {
          $scope.getUsers();
        });
    }

    $scope.getUsers();
  }

  function EditUserController($scope, $mdDialog, selected, usersService, toastService) {
    $scope.selected = selected[0];
    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.saveUser = function () {
      if ($scope.edituserForm.$valid) {
        usersService.updateUser($scope.selected).then(function (res) {
          $scope.hide();
          toastService.show("Edited Successfully!!")
        });
      }
    };
  };

  function AddUserController($scope, $mdDialog, LoginService, toastService) {    
    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.saveUser = function () {
      if ($scope.edituserForm.$valid) {
        LoginService.Register($scope.selected).then(function (res) {
          $scope.hide();
          toastService.show("Added Successfully!!")
        });
      }
    };
  }
  
})();