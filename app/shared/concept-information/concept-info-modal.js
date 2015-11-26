'use strict';

angular
    .module('conceptRequestServiceApp.conceptInfo', [])

    .controller('conceptInfoModalCtrl', [
        '$scope',
        '$rootScope',
        '$uibModalInstance',
        'snowowlService',
        'conceptId',
        function ($scope, $rootScope, $uibModalInstance, snowowlService, conceptId) {
            $scope.conceptId = conceptId;
            $scope.loadComplete = false;

            function initialize() {
                // get full concept if not retrieved
                snowowlService.getFullConcept(null, null, $scope.conceptId).then(function (concept) {
                    $scope.fullConcept = concept;
                    if ($scope.fullConcept && $scope.children && $scope.parents) {
                        $scope.loadComplete = true;
                    }
                });

                // get children if not retrieved
                snowowlService.getConceptChildren(null, null, $scope.conceptId)
                    .then(function (children) {
                        $scope.children = children;
                        if ($scope.fullConcept && $scope.children && $scope.parents) {
                            $scope.loadComplete = true;
                        }
                    });

                snowowlService.getConceptParents(null, null, $scope.conceptId)
                    .then(function (parents) {
                        $scope.parents = parents;
                        if ($scope.fullConcept && $scope.children && $scope.parents) {
                            $scope.loadComplete = true;
                        }
                    });
            }

            // closes the modal instance (if applicable)
            $scope.close = function () {
                $uibModalInstance.close();
            };

            $scope.loadConcept = function (conceptId) {
                $scope.fullConcept = null;
                $scope.conceptId = conceptId;
                $scope.loadComplete = false;

                initialize();
            };

            initialize();

        }]
);
