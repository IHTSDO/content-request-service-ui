'use strict';

angular
    .module('conceptRequestServiceApp.crs')
    .factory('crsService', [
        '$http',
        '$q',
        'Upload',
        'configService',
        'errorHandlerService',
        function ($http, $q, Upload, configService, errorHandlerService) {
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

            var sendCrsRequest = function (method, resource, params, data, ignoreLoadingBar) {
                var url = getCrsEndpointUrl(resource);

                return sendRequest({
                    method: method,
                    url: url,
                    params: params,
                    data: data,
                    ignoreLoadingBar: (ignoreLoadingBar === true)
                });
            };

            var sendGet = function (resource, params, ignoreLoadingBar) {
                return sendCrsRequest(HTTP_METHOD.GET, resource, params, null, ignoreLoadingBar);
            };

            var sendPut = function (resource, params, data) {
                return sendCrsRequest(HTTP_METHOD.PUT, resource, params, data);
            };

            var sendPost = function (resource, params, data) {
                return sendCrsRequest(HTTP_METHOD.POST, resource, params, data);
            };

            var sendDelete = function (resource, params, data) {
                return sendCrsRequest(HTTP_METHOD.DELETE, resource, params, data);
            };

            var sendUpload = function (resource, file) {
                var params = {},
                    data = {
                        'batchFile': file
                    };

                return Upload.upload({
                    url: getCrsEndpointUrl(resource),
                    data: data,
                    params: params,
                    method: HTTP_METHOD.POST,
                    withCredentials: true
                });

                /*.progress(function(evt) {
                    progress(Math.min(100, parseInt(100.0 * evt.loaded / evt.total)), evt);
                }).success(function(data, status, headers, config) {
                    success(data, status, headers, config);
                }).error(function (e) {
                    error(e);
                });*/
            };


            var getServerVersion = function () {
                var SERVER_VERSION_ENDPOINT = 'common/version';

                return sendGet(SERVER_VERSION_ENDPOINT);
            };

            return {
                sendRequest: sendRequest,
                sendGet: sendGet,
                sendPut: sendPut,
                sendPost: sendPost,
                sendDelete: sendDelete,
                sendUpload: sendUpload,
                getServerVersion: getServerVersion
            };
        }
    ]);