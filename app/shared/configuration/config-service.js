'use strict';

angular
    .module('conceptRequestServiceApp.configuration', [
    ])
    .provider('configService', function () {
        var config;

        this.config = function (configObj) {
            config = configObj;
        };

        this.$get = [
            function () {
                var getConfig = function () {
                    return config;
                };

                var getEndpointConfig = function (endPoint) {
                    if (config === null) {
                        return null;
                    }

                    if (endPoint === undefined || endPoint === null) {
                        return config.endpoint;
                    } else {
                        return config.endpoint[endPoint];
                    }
                };

                var getRequestTimeout = function () {
                    return config.xhrTimeout;
                };

                return {
                    getConfig: getConfig,
                    getEndpointConfig: getEndpointConfig,
                    getRequestTimeout: getRequestTimeout
                };
            }
        ];
    });