(function () {
    'use strict';

    angular.module('elibrary').service('booksService', function ($http) {

        function Books(data) {
            var URL = "/api/GetBooks";
            var promise = $http.post(URL, data).then(function (response) {
                return response.data;
            });

            return promise;        
        }

        function Categories() {
            var URL = "/api/GetCategories";

            var promise = $http({
                method: 'GET',
                url: URL
            }).then(function (response) {
                return response.data;
            });

            return promise;
        }

        function AssignUser(data) {
            var URL = "/api/AssignUser";
            var promise = $http.post(URL, data).then(function (response) {
                return response.data;
            });

            return promise;
        }

        function deleteBook(id) {
            var URL = "/api/deleteBook/" + id;

            var promise = $http({
                method: 'GET',
                url: URL
            }).then(function (response) {
                return response.data;
            });

            return promise;
        }

        function AddBook(data) {
            var URL = "/api/addbook";
            var promise = $http.post(URL, data).then(function (response) {
                return response.data;
            });

            return promise;
        }

        function AddRating(data) {
            var URL = "/api/AddRating";
            var promise = $http.post(URL, data).then(function (response) {
                return response.data;
            });

            return promise;
        }    

        function AddComment(data) {
            var URL = "/api/AddComment";
            var promise = $http.post(URL, data).then(function (response) {
                return response.data;
            });

            return promise;
        }    
        
        function updateBook(doc) {
            var URL = "/api/UpdateBook";

            var promise = $http({
                method: 'GET',
                url: URL,
                params: doc
            }).then(function (response) {
                return response.data;
            });

            return promise;
        }

        return {
            Books: Books,
            Categories: Categories,
            deleteBook: deleteBook,
            updateBook: updateBook,
            AddBook: AddBook,
            AssignUser:AssignUser,
            AddRating:AddRating,
            AddComment:AddComment
        }
    });
})();