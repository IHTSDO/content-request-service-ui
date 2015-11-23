'use strict';

angular
    .module('conceptRequestServiceApp.conceptEdit', [])
    .value('CONCEPT_EDIT_EVENT', {
        STOP_EDIT_CONCEPT: 'stopEdit:stopEditing'
    });
