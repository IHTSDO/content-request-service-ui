'use strict';
angular.module('conceptRequestServiceApp.search')

    .controller('searchPanelCtrl', [
        '$scope',
        '$rootScope',
        '$uibModal',
        '$location',
        '$routeParams',
        '$q',
        '$http',
        'notificationService',
        'snowowlService',
        'savedListService',
        function ($scope, $rootScope, $uibModal, $location, $routeParams, $q, $http, notificationService, snowowlService, savedListService) {
            var panelId = $scope.panelId;

            // controller $scope.options
            //$scope.branch = 'MAIN/' + $routeParams.projectKey + '/' + $routeParams.taskKey;
            $scope.resultsPage = 1;
            $scope.resultsSize = 20;
            $scope.loadPerformed = false;
            $scope.loadMoreEnabled = false;
            $scope.searchStr = '';
            $scope.searchAfter = '';

            // the displayed results
            $scope.results = [];

            // the stored results
            $scope.storedResults = [];

            // user controls
            $scope.userOptions = {
                groupByConcept: true
            };

            // $scope.options from searchPlugin.js ( not all used)
            // TODO Make these enabled
            // $scope.options = {
            //     serverUrl: '/snowowl',
            //     edition: 'snomed-ct/v2/browser',
            //     release: $scope.branch,
            //     selectedView: 'inferred',
            //     displayChildren: false,
            //     langRefset: '900000000000509007',
            //     closeButton: false,
            //     collapseButton: false,
            //     linkerButton: false,
            //     subscribersMarker: true,
            //     searchMode: 'partialMatching',
            //     searchLang: 'english',
            //     diagrammingMarkupEnabled: false,
            //     statusSearchFilter: 'activeOnly',
            //     highlightByEffectiveTime: 'false',
            //     taskSet: false,
            //     taskKey: null
            // };

            $scope.toggleGroupByConcept = function () {
                $scope.userOptions.groupByConcept = !$scope.userOptions.groupByConcept;
                $scope.processResults();

            };

            $scope.searchType = 'Active Only';
            $scope.userOptions.searchType = 1;

            $scope.toggleSearchType = function (){
                if($scope.searchType === 'Active and Inactive')
                {
                    $scope.searchType = 'Active Only'; 
                    $scope.userOptions.searchType = 1;
                }
                else if($scope.searchType === 'Active Only')
                {
                    $scope.searchType = 'Inactive Only';
                    $scope.userOptions.searchType = 2;
                }
                else
                {
                    $scope.searchType = 'Active and Inactive';   
                    $scope.userOptions.searchType = 0;
                }
                $scope.processResults();
            };

            /**
             * Helper function to manipulate displayed concepts
             */
            $scope.processResults = function () {

                console.debug('processing results', $scope.userOptions);

                // group concepts by SCTID
                var displayedResults = [];

                // temp array for tracking duplicate ids
                var tempIds = [];

                // cycle over all results
                for (var i = 0; i < $scope.storedResults.length; i++) {

                    //console.debug('checking', i, $scope.storedResults[i].concept.fsn);
                    //console.log($scope.storedResults[i].concept.conceptId);

                    // if item already added skip
                    if (tempIds.indexOf($scope.storedResults[i].concept.conceptId) === -1) {

                        console.debug('not already in displayed results');

                        // push the item
                        displayedResults.push($scope.storedResults[i]);

                        // add id to the temp list
                        tempIds.push($scope.storedResults[i].concept.conceptId);

                        // cycle over items remaining in list
                        for (var j = i + 1; j < $scope.storedResults.length; j++) {

                            // if second item matches, push it to new results and remove from
                            // list
                            if ($scope.storedResults[i].concept.conceptId === $scope.storedResults[j].concept.conceptId) {

                                console.debug('duplicate concept found', $scope.storedResults[j].concept.fsn);

                                // add duplicate to list if (1) groupByConcept is off, and (2)
                                // displayed results do not already contain this item
                                if (!$scope.userOptions.groupByConcept) {
                                    console.debug('--> pushing (not group by concept');
                                    displayedResults.push($scope.storedResults[j]);
                                }
                            }
                        }
                    }
                }

                // $scope.results = displayedResults;
                if($scope.userOptions.searchType === 1){
                    $scope.results = displayedResults.filter(function (item) {
                      return item.concept.active === true;
                    });
                }
                else if($scope.userOptions.searchType === 2){
                    $scope.results = displayedResults.filter(function (item) {
                      return item.concept.active === false;
                    });
                }
                else{
                    $scope.results = displayedResults;
                }

                // user cue for status
                if ($scope.results.length === 0) {
                    $scope.searchStatus = 'No results';
                } else {
                    $scope.searchStatus = null;
                }
            };



            /**
             * Executes a search based on current scope variable searchStr
             * @param appendResults if true, append to existing results; if false,
             *   replace results
             */
            $scope.search = function (appendResults) {

                if (!$scope.searchStr || $scope.searchStr.length < 3) {
                    return;
                }

                $scope.searchStatus = 'Searching...';

                // trim and lower-case the swearch string
                $scope.searchStr = $scope.searchStr.trim();
                var t = $scope.searchStr;

                // initialize or clear the results list
                if (!$scope.results || !appendResults) {
                    $scope.results = [];
                    $scope.storedResults = [];
                }

                var patt = new RegExp('^\\d+\\s\\|.*\\|$');
                if (patt.test(t)) {
                    t = t.substring(0, t.indexOf(' '));
                }

                snowowlService.findConcepts(null, null, t, $scope.searchAfter, $scope.resultsSize).then(function (response) {

                    var concepts = response.items ? snowowlService.transformConceptSnowowlToSnowstorm(response.items) : response;

                    if (!concepts) {
                        notificationService.sendError('Unexpected error searching for concepts', 10000);
                    }

                    // set load more parameters
                    $scope.loadPerformed = true;
                    $scope.loadMoreEnabled = concepts.length === $scope.resultsSize;

                    //console.log($scope.storedResults.length);
                    $scope.storedResults = appendResults ? $scope.storedResults.concat(concepts) : concepts;
                    $scope.searchAfter = response.searchAfter;

                    $scope.processResults();

                }, function (error) {
                    console.debug('error', error);
                    $scope.searchStatus = 'Error performing search: ' + error;
                    if (error.statusText) {
                        $scope.searchStatus += ': ' + error.statusText;
                    }
                    if (error.data && error.data.message) {
                        $scope.searchStatus += ': ' + error.data.message;
                    }
                });
            };

            /**
             * Function to load another page of results
             */
            $scope.loadMore = function () {
                $scope.search(true); // search in append mode
            };

            $scope.viewConceptInTaxonomy = function(item) {
                $rootScope.$broadcast('viewTaxonomy', {
                    concept: {
                        conceptId: item.concept.conceptId,
                        fsn: item.concept.fsn
                    }
                });
            };

            /**
             * Clears results, resets query and page
             */
            $scope.clearSearch = function () {
                $scope.searchStr = '';
                $scope.resultsPage = 1;
                $scope.results = [];
                $scope.searchStatus = null;
                $scope.loadPerformed = false;
                $scope.searchAfter = '';
            };

            /**
             * Add item to save list
             * @param item The full item in browser format: {term, active, concept:
             *   {}}
             */
            $scope.addItemToSavedList = function (item) {
                if (!item || !item.concept) {
                    return;
                }

                // if not already in saved list
                if ($scope.findItemInSavedList(item.concept.conceptId) === false) {
                    savedListService.addItem(panelId, item);
                }
            };

            /**
             * Determine if an item is in the saved list
             * @param id the SCTID of the concept checked
             * @returns {boolean} true: exists, false: does not exist
             */
            $scope.findItemInSavedList = function (searchingConceptId) {
                var savedList = savedListService.getSavedList(panelId);
                var item;

                if (angular.isArray(savedList) && savedList.length > 0) {
                    for (var i in savedList) {
                        item = savedList[i];

                        if (item && item.concept && item.concept.conceptId === searchingConceptId) {
                            return true;
                        }
                    }
                }

                return false;
            };

            $scope.openConceptInformationModal = function (result) {
                /*var modalInstance = */$uibModal.open({
                    templateUrl: 'shared/concept-information/concept-info-modal.html',
                    controller: 'conceptInfoModalCtrl',
                    resolve: {
                        conceptId: function () {
                            return result.concept.conceptId;
                        },
                        branch: function () {
                            return $scope.branch;
                        }
                    }
                });

                /*modalInstance.result.then(function (response) {
                    // do nothing
                }, function () {
                    // do nothing
                });*/
            };

            /**
             * Constructs drag/drop concept object for a concept
             * @param concept the concept in browser format: {term, active, concept:
       *   {}}
             * @returns {{id: conceptId, name: fsn}}
             */
            $scope.getConceptPropertiesObj = function (concept) {
                console.debug('Getting concept properties obj', concept);
                return {id: concept.conceptId, name: concept.fsn};
            };

        }
    ])
;