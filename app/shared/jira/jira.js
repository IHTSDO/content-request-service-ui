'use strict';

angular
    .module('conceptRequestServiceApp.jira', [])
    .value('JIRA_API', {
        SEARCH: 'search',
        PICKER: 'picker'
    })
    .value('JIRA_TARGET', {
        GROUP: {
            path: 'group'
        },
        USER: {
            path: 'user'
        }
    })
    .value('JIRA_BASIC_AUTHORIZATION', 'Basic Y3JzLXRlc3QtYWRtaW5pc3RyYXRvcjpnQzc4NWMycQ==');