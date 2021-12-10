'use strict';

angular
    .module('conceptRequestServiceApp.savedList', [])
    .value('SAVED_LIST_EVENT', {
        LIST_UPDATED: 'savedList:updated',
        ITEM_REMOVED: 'savedList:removeItem',
        ITEM_ADDED: 'savedList:addItem',
        EDIT_CONCEPT: 'savedList:editConcept',
        STOP_EDIT_CONCEPT: 'savedList:stopEditing'
    });
