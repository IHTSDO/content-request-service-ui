'use strict';

angular
    .module('conceptRequestServiceApp.taxonomy', [])
    .value('TAXONOMY_ROOT_NODE', {
        active: true,
        conceptId: 138875005,
        definitionStatus: 'PRIMITIVE',
        fsn: 'SNOMED CT Concept',
        isLeafInferred: false,
        isLeafStated: false
    })
    .config(function ($rootScopeProvider) {
        // up the digest limit to account for extremely long depth of SNOMEDCT trees leading to spurious errors
        // this is not an ideal solution, but this is a known edge-case until Angular 2.0 (see https://github.com/angular/angular.js/issues/6440)
        $rootScopeProvider.digestTtl(20);
    });