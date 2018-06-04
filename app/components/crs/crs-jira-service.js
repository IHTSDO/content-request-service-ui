'use strict';

angular
    .module('conceptRequestServiceApp.crs')
    .factory('crsJiraService', [
        'crsService',
        'jiraService',
        'CRS_API_ENDPOINT',
        function (crsService, jiraService, CRS_API_ENDPOINT) {
            var getAuthorUsers = function (startIndex, count, getAll, users, groupName) {
                var requestEndpoint = CRS_API_ENDPOINT.REQUEST;

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
                        groupname: groupName,
                        expand: 'users'
                    };

                    if (isFiniteNumber(ind) && isFiniteNumber(size)) {
                        params.expand += ('[' + ind + ':' + (ind + size - 1) + ']');
                    }

                    return params;
                };

                return crsService.sendGet(requestEndpoint + '/authoringUser/list', buildParams(startIndex, count)).then(function (data) {
                    if (data.error) {
                        return [];
                    } else if (data.users) {
                        users = users.concat(data.users.items);
                        var groupname = groupName;
                        if (getAll === true && data.users['end-index'] !== 0 && data.users['end-index'] < (data.users.size - 1) ) {
                            return getAuthorUsers(startIndex + count, count, getAll, users, groupname);
                        } else {
                            return users;
                        }
                    }
                });
            };

            var getSemanticTags = function(){
                var requestEndpoint = CRS_API_ENDPOINT.REQUEST;
                return crsService.sendGet(requestEndpoint + '/semanticTagOptions').then(function(semanticTags){
                    if(semanticTags.error){
                        return [];
                    }else if(semanticTags){
                        return semanticTags;
                    }
                });
            };

            var getTopicOptions = function(){
                var requestEndpoint = CRS_API_ENDPOINT.REQUEST;
                return crsService.sendGet(requestEndpoint + '/topicOptions').then(function(topicOptions){
                    if(topicOptions.error){
                        return [];
                    }else if(topicOptions){
                        return topicOptions;
                    }
                });
            };

            var getOrganizationOptions = function () {
                var requestEndpoint = CRS_API_ENDPOINT.REQUEST;
                return crsService.sendGet(requestEndpoint + '/organizationOptions').then(function (organizationOptions) {
                    if (organizationOptions.error) {
                        return [];
                    } else if (organizationOptions) {
                        return organizationOptions;
                    }
                });
            };

            var getCollaborationAgreementOptions = function () {
                var requestEndpoint = CRS_API_ENDPOINT.REQUEST;
                return crsService.sendGet(requestEndpoint + '/collaborationAgreementOptions').then(function (collaborationAgreementOptions) {
                    if (collaborationAgreementOptions.error) {
                        return [];
                    } else if (collaborationAgreementOptions) {
                        return collaborationAgreementOptions;
                    }
                });
            };

            return {
                getAuthorUsers: getAuthorUsers,
                getSemanticTags: getSemanticTags,
                getTopicOptions: getTopicOptions,
                getOrganizationOptions: getOrganizationOptions,
                getCollaborationAgreementOptions: getCollaborationAgreementOptions
            };
        }
    ]);