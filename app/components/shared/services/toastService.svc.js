(function () {
    'use strict';

    angular.module('elibrary').service('toastService', function ($mdToast) {

        return {
            show: show
        };

        function show(messageText, position,delay) {
            position = position || "bottom";
            delay = delay || 3000;

            $mdToast.show(
                $mdToast.simple()
                    .textContent(messageText)
                    .position(position)
                    .hideDelay(delay)
            );
        }
    })
})();
