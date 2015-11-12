'use strict';

angular
    .module('conceptRequestServiceApp.crs')
    .factory('crsService', [
        '$http',
        '$q',
        'configService',
        'errorHandlerService',
        function ($http, $q, configService, errorHandlerService) {
            var HTTP_METHOD = {
                GET: 'GET',
                POST: 'POST',
                PUT: 'PUT',
                DELETE: 'DELETE'
            };
            var crsEndpoint = configService.getEndpointConfig('crs');

            var getCrsEndpointUrl = function (resource) {
                return crsEndpoint + resource;
            };

            var sendRequest = function (request) {
                var deferred = $q.defer();

                request.timeout = configService.getRequestTimeout();
                request.withCredentials = true;
                $http(request).success(function (response) {
                    if (response.success === false) {
                        deferred.reject(errorHandlerService.buildCustomError(response.error)); // return error reason
                    } else {
                        deferred.resolve(response.payload || response);
                    }
                }).error(function (response, status) {
                    deferred.reject(errorHandlerService.buildHttpError(response, status)); // return error reason
                });

                return deferred.promise;
            };

            var sendCrsRequest = function (method, resource, params, data) {
                var url = getCrsEndpointUrl(resource);

                return sendRequest({
                    method: method,
                    url: url,
                    params: params,
                    data: data
                });
            };

            var sendGet = function (resource, params) {
                return sendCrsRequest(HTTP_METHOD.GET, resource, params);
            };

            var sendPut = function (resource, params, data) {
                return sendCrsRequest(HTTP_METHOD.PUT, resource, params, data);
            };

            var sendPost = function (resource, params, data) {
                return sendCrsRequest(HTTP_METHOD.POST, resource, params, data);
            };

            var sendDelete = function (resource, params) {
                return sendCrsRequest(HTTP_METHOD.DELETE, resource, params, data);
            };

            return {
                sendRequest: sendRequest,
                sendGet: sendGet,
                sendPut: sendPut,
                sendPost: sendPost,
                sendDelete: sendDelete
            };
        }
    ]);