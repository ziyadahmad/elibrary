(function () {
    'use strict';

    var app = angular.module('elibrary');
    app.directive('toolbar', toolbar);

    function toolbar() {
        return {
            templateUrl: 'components/toolbar/toolbar.tpl.html',
            controller: toolbarController,
            controllerAs: 'toolbar'
        }
    };

    function toolbarController($scope, $mdSidenav, $rootScope) {
        var vm = this;
        vm.openLeftMenu = openLeftMenu;        
        vm.logout = logout;        

        function openLeftMenu() {
            $mdSidenav('left').toggle();
        };

        function logout() {
            $rootScope.IsAuthenticated = false;
        };
    };

})();

