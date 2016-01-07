/*jshint sub:true*/
'use strict';

angular.module('conceptRequestServiceApp.jira')
    .provider('jiraService', function () {
        var provider = this;
        var config, jiraEndpoint;

        provider.setJiraEndpoint = function (endpoint) {
            jiraEndpoint = endpoint;
        };

        provider.config = function (jiraConfig) {
            config = jiraConfig;
        };

        provider.$get = [
            '$http',
            '$q',
            'JIRA_API',
            'JIRA_TARGET',
            'JIRA_BASIC_AUTHORIZATION',
            function ($http, $q, JIRA_API, JIRA_TARGET, JIRA_BASIC_AUTHORIZATION) {

                var getJiraEndpointUrl = function (method, target, param) {
                    var restApiConfig = config['rest-api'];
                    var url = jiraEndpoint + restApiConfig.path + restApiConfig.version;

                    if (target) {
                        url += '/' + target;
                    }

                    if (method) {
                        url += '/' + method;
                    }

                    if (param !== undefined && param !== null) {
                        url += '/' + param;
                    }

                    return url;
                };

                var sendRequest = function (request) {
                    request.withCredentials = true;
                    if (request.headers === undefined || request.headers === null) {
                        request.headers = {};
                    }

                    request.headers['Authorization'] = JIRA_BASIC_AUTHORIZATION;


                    return $http(request);
                };

                var sendJiraRequest = function (httpMethod, apiMethod, apiTarget, pathParam, params, data) {
                    var url = getJiraEndpointUrl(apiMethod, apiTarget.path, pathParam);

                    return sendRequest({
                        method: httpMethod,
                        url: url,
                        params: params,
                        data: data
                    });
                };

                var getJiraConfig = function () {
                    return config;
                };

                var getJiraEndpointConfig = function () {
                    return jiraEndpoint;
                };

                var getAuthorUsers = function (startIndex, count, getAll, users) {
                    if (!users) {
                        users = [];
                    }

                    var isFiniteNumber = function (number) {
                        return (number !== undefined &&
                            number !== null &&
                            !isNaN(number) &&
                            number >= 0);
                    };

                    var buildParams = function (ind, size) {
                        var params = {
                            groupname: config['author-group'],
                            expand: 'users'
                        };

                        if (isFiniteNumber(ind) && isFiniteNumber(size)) {
                            params.expand += ('[' + ind + ':' + (ind + size - 1) + ']');
                        }

                        return params;
                    };

                    return sendJiraRequest('GET', null, JIRA_TARGET.GROUP, null, buildParams(startIndex, count)).then(function (response) {
                        var data = response.data;
                        if (data.error) {
                            return [];
                        } else if (data.users) {
                            users = users.concat(data.users.items);

                            if (getAll === true && data.users['end-index'] !== 0 && data.users['end-index'] < (data.users.size - 1) ) {
                                return getAuthorUsers(startIndex + count, count, getAll, users);
                            } else {
                                return users;
                            }
                        }
                    });
                };

                return {
                    getJiraConfig: getJiraConfig,
                    getJiraEndpointConfig: getJiraEndpointConfig,
                    getAuthorUsers: getAuthorUsers
                };
            }
        ];
    });
