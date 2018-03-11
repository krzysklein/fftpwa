"use strict";

angular.module('App', ['ngMaterial', 'ngMessages'])
    .controller('MainController', ['$scope', '$http', MainController]);

function MainController($scope, $http) {
    $scope.refresh = _refresh;

    $scope.refresh();

    function _refresh() {
        $scope.model = null;

        $http.get('/api/weather')
            .then(function (response) {
                $scope.model = response.data;
            }, function (response) {
                console.log('Error: ', response);
            });
    }
}
