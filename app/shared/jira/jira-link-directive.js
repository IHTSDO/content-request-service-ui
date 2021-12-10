'use strict';

angular.module('conceptRequestServiceApp.jira')
    .directive('jiraLink', [
        function () {
            /*var getJiraLink = function (issueId) {
                var jiraEndpoint = jiraService.getJiraEndpointConfig();

                return jiraEndpoint + 'browse/' + issueId;
            };*/

            return {
                restrict: 'A',
                replace: true,
                scope: {
                    ticketId: '=jiraLink'
                },
                link: function ($scope, $element) {
                    if ($scope.ticketId) {
                        /*$element.html(
                            [
                                '<a class="tooltips-right" style="color:#42A5F5;cursor:pointer" target="_blank" href="' + getJiraLink($scope.ticketId) + '">',
                                $scope.ticketId,
                                '<span >Click to open Jira ticket</span>',
                                '</a>'
                            ].join('')
                        );*/
                        $element.html($scope.ticketId);

                        /*$element.bind('click', function (event) {
                            event.stopPropagation();
                        });*/
                    }
                }
            };
        }
    ]);
