(function () {
    'use strict';

    angular.module('elibrary').service('LoginService', function ($http) {        

        function Register(data) {
            var URL = "/api/registeruser";
            var promise = $http.post(URL, data).then(function (response) {
                return response.data;
            });

            return promise;
        }

        function Authenticate(params) {
            var URL = "/api/loginuser";
            
            var promise = $http({
                method: 'GET',
                url: URL,
                params: params
            }).then(function (response) {
                return response.data;
            });
            
            return promise;
        }

        return {
            Authenticate: Authenticate,
            Register: Register
        }
    });
})();