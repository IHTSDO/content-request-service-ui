'use strict';

angular
    .module('conceptRequestServiceApp.savedList')

    .controller('savedListCtrl', [
        '$scope',
        '$rootScope',
        'savedListService',
        'SAVED_LIST_EVENT',
        function ($scope, $rootScope, savedListService, SAVED_LIST_EVENT) {
            var panelId = $scope.panelId;
            var editingItems = [];

            var initialize = function () {
                $scope.savedList = savedListService.getSavedList(panelId);
                $scope.$on(SAVED_LIST_EVENT.LIST_UPDATED, function (event, data) {
                    if (data) {
                        $scope.savedList = savedListService.getSavedList(panelId);
                    }
                });
            };

            // function to select an item from the saved list
            // broadcasts selected conceptId
            $scope.selectItem = function (item) {
                if (!item) {
                    return;
                }

                savedListService.editItem(item);
                editingItems.push(item);
            };

            $scope.removeItem = function (item) {
                if (item) {
                    $scope.savedList = savedListService.removeItem(panelId, item);
                }
            };

            $scope.isEditing = function (item) {
                return editingItems.indexOf(item) !== -1;
            };

            $scope.getConceptPropertiesObj = function (item) {
                return {id: item.concept.conceptId, name: item.concept.fsn};
            };

            initialize();

        }]);
