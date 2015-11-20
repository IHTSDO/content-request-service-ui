'use strict';

angular
    .module('conceptRequestServiceApp.savedList')
    .factory('savedListService', [
        '$rootScope',
        'SAVED_LIST_EVENT',
        function ($rootScope, SAVED_LIST_EVENT) {
            var savedList = {};

            var getSavedList = function (panelId) {
                return savedList[panelId];
            };

            var addItem = function (panelId, item) {
                if (!angular.isArray(savedList[panelId])) {
                    savedList[panelId] = [];
                }

                if (item !== undefined && item !== null) {
                    savedList[panelId].push(item);
                    $rootScope.$broadcast(SAVED_LIST_EVENT.LIST_UPDATED, item);
                    $rootScope.$broadcast(SAVED_LIST_EVENT.ITEM_ADDED, item);
                }
            };

            var removeItem = function (panelId, item) {
                var index, list;

                if (!panelId) {
                    panelId = 'DEFAULT';
                }

                list = savedList[panelId];

                if (angular.isArray(list) && list.length > 0) {
                    index = list.indexOf(item);

                    if (index !== -1) {
                        list.splice(index, 1);
                        $rootScope.$broadcast(SAVED_LIST_EVENT.LIST_UPDATED, item);
                        $rootScope.$broadcast(SAVED_LIST_EVENT.ITEM_REMOVED, item);
                    }
                }

                return savedList[panelId];
            };

            var editItem = function (item) {
                $rootScope.$broadcast(SAVED_LIST_EVENT.EDIT_CONCEPT, item);
                console.log(item);
            };

            var stopEditingItem = function (item) {
                $rootScope.$broadcast(SAVED_LIST_EVENT.STOP_EDIT_CONCEPT, item);
            };

            return {
                getSavedList: getSavedList,
                addItem: addItem,
                removeItem: removeItem,
                editItem: editItem,
                stopEditingItem: stopEditingItem
            }
        }
    ]);
