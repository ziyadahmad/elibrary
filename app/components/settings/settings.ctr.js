(function () {
  'use strict';

  angular
    .module('elibrary')
    .controller('settingsController', settingsController);

  function DialogController($scope, $mdDialog, selected, SettingsService,toastService) {
    $scope.selected = selected[0];

    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.saveUser = function () {
      if ($scope.edituserForm.$valid) {
        SettingsService.updateUser($scope.selected).then(function (res) {
          $scope.hide();
          toastService.show("Edited Successfully!!")
        });
      }
    };
  };

  function settingsController($scope, SettingsService, $mdDialog, toastService) {
    $scope.selected = [];

    $scope.query = {
      order: 'userID',
      limit: 5,
      page: 1
    };

    $scope.getUsers = function () {
      $scope.promise = SettingsService.Users().then(function (response) {
        $scope.users = response;
        $scope.selected = [];
      }).$promise;
    };

    $scope.addItem = function (event) {

    };

    $scope.deleteItem = function (event) {
      var confirm = $mdDialog.confirm()
        .title('Are you sure you want to delete User?')
        .targetEvent(event)
        .ok('Delete')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function () {
        $scope.selected.forEach(function (element) {
          SettingsService.deleteUser(element._id).then(function (res) {
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
        controller: DialogController,
        templateUrl: '/components/settings/settings.dlg.tpl.html',
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

})();