(function () {
  'use strict';

  angular
    .module('elibrary')
    .controller('booksController', booksController);

  function booksController($scope, booksService, $mdDialog, toastService) {
    $scope.selected = [];

    $scope.query = {
      order: '_id',
      limit: 5,
      page: 1
    };

    $scope.getBooks = function () {
      var profile = localStorage.getItem("Profile");
      $scope.promise = booksService.Books(profile).then(function (response) {
        $scope.books = response;
        $scope.selected = [];
      }).$promise;
    };

    $scope.addItem = function (event) {
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

    $scope.assignUser = function (event) {
      $mdDialog.show({
        controller: AssignBookController,
        templateUrl: '/components/books/assignbook.dlg.tpl.html',
        parent: angular.element(document.body),
        targetEvent: event,        
        locals: {
          selected: $scope.selected
        },
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
        .then(function () {
          $scope.getBooks();
        });
    };

    $scope.deleteItem = function (event) {
      var booksText = "book";
      if ($scope.selected.length > 1) { booksText = "books"; }

      var confirm = $mdDialog.confirm()
        .title('Are you sure you want to delete selected ' + booksText + '?')
        .targetEvent(event)
        .ok('Delete')
        .cancel('Cancel');

      $mdDialog.show(confirm).then(function () {
        $scope.selected.forEach(function (element) {
          booksService.deleteBook(element._id).then(function (res) {
            toastService.show(res.MESSAGE);
            $scope.getBooks();
          });
        }, this);
      }, function () {
        $scope.selected = [];
      });
    }

    $scope.editItem = function (event) {
      $mdDialog.show({
        controller: EditBookController,
        templateUrl: '/components/books/editbook.dlg.tpl.html',
        locals: {
          selected: $scope.selected
        },
        parent: angular.element(document.body),
        targetEvent: event,
        clickOutsideToClose: true,
        fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
      })
        .then(function () {
          $scope.getBooks();
        });
    }

    $scope.getBooks();
  }

  function EditBookController($scope, $mdDialog, selected, booksService, toastService) {
    $scope.selected = selected[0];
    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.promise = booksService.Categories().then(function (response) {
      $scope.Categories = response;
    }).$promise;

    $scope.saveBook = function () {
      if ($scope.editbookForm.$valid) {
        booksService.updateBook($scope.selected).then(function (res) {
          $scope.hide();
          toastService.show("Edited Successfully!!")
        });
      }
    };
  };

  function AddBookController($scope, $mdDialog, toastService, booksService) {
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
  };

  function AssignBookController($scope, $mdDialog, toastService, usersService,booksService,selected) {
    $scope.selected=selected;
    $scope.hide = function () {
      $mdDialog.hide();
    };

    $scope.getUsers = function () {
      $scope.promise = usersService.Users().then(function (response) {
        $scope.users = response;        
      }).$promise;
    };

    $scope.assignBook = function () {
       if ($scope.assignbookForm.$valid) {
         var selectedUsers = [];
         $scope.users.forEach(function(user){
           if(user.selected){
             selectedUsers.push(user._id);
           }
         });

         var param = {users:selectedUsers,bookID:$scope.selected[0]._id};
         booksService.AssignUser(param).then(function (res) {
           $scope.hide();
           toastService.show("Assigned Successfully!!")
         });
       }
    };
    
    $scope.getUsers();
  }

})();