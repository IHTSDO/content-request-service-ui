'use strict';

angular
    .module('conceptRequestServiceApp.snowowl', [])
    .value('SNOWOWL_API', {
        BROWSER: 'browser',
        MRCM: 'mrcm'
    })
    .value('SNOWOWL_TARGET', {
        CONCEPT: {
            path: 'concepts',
            indicator: '0'
        },
        DESCRIPTION: {
            path: 'descriptions',
            indicator: '1'
        },
        RELATIONSHIP: {
            path: 'relationships',
            indicator: '2'
        },
        DOMAIN_ATTRIBUTE: {
            path: 'domain-attributes'
        },
        DOMAIN_ATTRIBUTE_VALUE: {
            path: 'attribute-values'
        }
    })
    .value('SCA_TARGET', {
        PROJECT: {
            path: 'projects'
        }
    })
    .value('SNOWOWL_BASIC_AUTHORIZATION', 'Basic c25vd293bDpzbm93b3ds');