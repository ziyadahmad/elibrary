(function () {
    'use strict';

    angular.module('elibrary').service('usersService', function ($http) {                

        function Users() {
            var URL = "/api/GetUsers";
            
            var promise = $http({
                method: 'GET',
                url: URL                
            }).then(function (response) {
                return response.data;
            });
            
            return promise;
        }

        function deleteUser(id) {
            var URL = "/api/deleteUser/"+ id;
            
            var promise = $http({
                method: 'GET',
                url: URL                    
            }).then(function (response) {
                return response.data;
            });
            
            return promise;
        }

        function updateUser(doc) {
            var URL = "/api/UpdateUser";
            
            var promise = $http({
                method: 'GET',
                url: URL,
                params:doc                    
            }).then(function (response) {
                return response.data;
            });
            
            return promise;
        }        

        return {
            Users: Users,
            deleteUser:deleteUser,
            updateUser:updateUser   
        }
    });
})();