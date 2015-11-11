/**
 * Directive for using Dropzone.js in an AngularJS project.
 *
 * Based on angular-dropzone https://github.com/sandbochs/angular-dropzone/blob/master/lib/angular-dropzone.js
 * But implemented again, because source are not maintained
 */
angular.module('pcApp.datasets.directives.ckanImport', [])
    .directive('ckanImport', ['$http', 'API_CONF', function ($http, API_CONF) {
        return {
            restrict: 'A',
            templateUrl: function (el, attrs) {
                return 'modules/datasets/partials/ckan-import.html';
            },
            scope: {
                'loadData': '='
            },
            link: function (scope, element, attrs, ctrls) {
                scope.byNumResourcesGtZero = function (result) {
                    return result.num_resources > 0;
                }

                scope.byResourceTypeIn = function (types) {
                    return function (resource) {
                        for (var i in types) {
                            var type = types[i];
                            if (resource.format.toLowerCase() == type)
                                return true;
                        }
                        return false;
                    }
                }

                scope.loadResource = function (resource) {
                    $http({
                        url: API_CONF.DATASETS_MANAGER_URL + '/ckan/download',
                        params: {
                            api: attrs.apiBase,
                            id: resource.id,
                            convert: true
                        }
                    }).then(function (response) {
                        scope.loadData(response.data);
                    });


                }

                scope.search = function (term) {
                    $http({
                        url: API_CONF.DATASETS_MANAGER_URL + '/ckan/search',
                        params: {
                            api: attrs.apiBase,
                            q: term
                        }
                    }).then(function (response) {
                        scope.results = response.data.result.results;
                    });
                }
            }
        }
    }]);