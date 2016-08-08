'use strict';

angular.module('conceptRequestServiceApp.snowowl')
    .provider('scaService', function () {
        var provider = this;
        var config, snowowlEndpoint;

        provider.setSnowowlEndpoint = function (endpoint) {
            snowowlEndpoint = endpoint;
        };

        provider.config = function (scaConfig) {
            config = scaConfig;
        };

        provider.$get = [
            '$http',
            '$q',
            'SCA_TARGET',
            function ($http, $q, SCA_TARGET) {

                var getScaEndpointUrl = function (param) {

                    var url = snowowlEndpoint + config.path ;

                    if (param !== undefined && param !== null) {
                        url +=  param;
                    }

                    return url;
                };

                var sendRequest = function (request) {
                    request.withCredentials = true;
                    if (request.headers === undefined || request.headers === null) {
                        request.headers = {};
                    }

                    //request.headers['Authorization'] = SNOWOWL_BASIC_AUTHORIZATION;

                    return $http(request);
                };

                var sendScaRequest = function (httpMethod, pathParam, params, data) {
                    var url = getScaEndpointUrl(pathParam);

                    return sendRequest({
                        method: httpMethod,
                        url: url,
                        params: params,
                        data: data
                    });
                };

                var getScaConfig = function () {
                    return config;
                };

                var getProjects = function () {
                    return sendScaRequest('GET', SCA_TARGET.PROJECT.path, null, null, null)
                        .then(function (response) {
							var data = response.data;
                            return data;
                        });
                };

                return {
                    getScaConfig: getScaConfig,
                    getProjects: getProjects
                };
            }
        ];
    });
