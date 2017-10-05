'use strict';

angular
    .module('conceptRequestServiceApp.configuration', [
    ])
    .provider('configService', function () {
        var config,
            configFromServer;

        this.config = function (configObj) {
            config = configObj;
        };

        this.configFromServer = function (configObj) {
            configFromServer = configObj;
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

                var getFileStatusPollingInterval = function () {
                    return config.fileStatusPollingInterval;
                };

                var getMessagePollingInterval = function () {
                    return config.messagePollingInterval;
                };

                var getConfigFromServer = function () {
                    return configFromServer;
                };

                var setConfigFromServer = function (configObj) {
                    configFromServer = configObj;
                };

                return {
                    getConfig: getConfig,
                    getFileStatusPollingInterval: getFileStatusPollingInterval,
                    getMessagePollingInterval: getMessagePollingInterval,
                    getEndpointConfig: getEndpointConfig,
                    getRequestTimeout: getRequestTimeout,
                    getConfigFromServer: getConfigFromServer,
                    setConfigFromServer: setConfigFromServer
                };
            }
        ];
    });