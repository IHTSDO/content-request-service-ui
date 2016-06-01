'use strict';

angular
    .module('conceptRequestServiceApp.jiraComment')
    .service('jiraCommentService', [
        'crsService',
        'CRS_API_ENDPOINT',
        function (crsService, CRS_API_ENDPOINT) {

            var getComments = function (requestId) {
                var requestEndpoint = CRS_API_ENDPOINT.REQUEST;

                return crsService.sendGet(requestEndpoint + '/' + requestId + '/comments', null);
            };

            var postComments = function (requestId, comment, isInternal) {
                var requestEndpoint = CRS_API_ENDPOINT.REQUEST;
                var data = {
                    comment: comment,
                    internal:isInternal
                };

                return crsService.sendPost(requestEndpoint + '/' + requestId + '/comments', null, data);
            };

            return {
                getComments: getComments,
                postComments: postComments
            };
        }
    ]);