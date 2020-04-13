'use strict';

angular.module('conceptRequestServiceApp.request')
    .service('requestMetadataService', [
        '$q',
        'REQUEST_METADATA_KEY',
		'utilsService',
        function ($q, REQUEST_METADATA_KEY, utilsService) {
            var metadata = {};

            // Source Terminology
            metadata[REQUEST_METADATA_KEY.SOURCE_TERMINOLOGY] = [
                'SNOMED CT International',
                'SNOMED CT Canadian English Extension',
                'SNOMED CT Canadian French Extension'
            ];

			metadata[REQUEST_METADATA_KEY.SOURCE_TERMINOLOGY].sort(function(a, b) {
				return utilsService.compareStrings(a, b);
			});
			
            // Semantic Tag
            metadata[REQUEST_METADATA_KEY.SEMANTIC_TAG] = [
                'administrative concept',
                'assessment scale',
                'attribute',
                'body structure',
                'cell',
                'cell structure',
                'disorder',
                'environment',
                'environment location',
                'ethnic group',
                'event',
                'finding',
                'geographic location',
                'inactive concept',
                'life style',
                'link assertion',
                'linkage concept',
                'morphologic abnormality',
                'namespace concept',
                'observable entity',
                'occupation',
                'organism',
                'person',
                'physical force',
                'physical object',
                'procedure',
                'product',
                'qualifier value',
                'racial group',
                'record artifact',
                'regime/therapy',
                'religion/philosophy',
                'situation',
                'social concept',
                'specimen',
                'staging scale',
                'substance',
                'tumor staging'
            ];

            // Case Significance
            metadata[REQUEST_METADATA_KEY.CASE_SIGNIFICANCE] = [
                {value: 'ENTIRE_TERM_CASE_SENSITIVE', text: 'Entire term case sensitive'},
                {value: 'CASE_INSENSITIVE', text: 'Entire term case insensitive'},
                {value: 'INITIAL_CHARACTER_CASE_INSENSITIVE', text: 'Only initial character case insensitive'},
            ];
			
			metadata[REQUEST_METADATA_KEY.CASE_SIGNIFICANCE].sort(function(a, b) {
				return utilsService.compareStrings(a.text, b.text);
			});

            // Relationship Type
            metadata[REQUEST_METADATA_KEY.RELATIONSHIP_TYPE] = [
                'Is a',
                'Access',
                'Associated finding',
                'Associated morphology',
                'Associated procedure',
                'Associated with',
                'After',
                'Causative agent',
                'Due to',
                'Clinical course',
                'Component',
                'Direct device',
                'Direct morphology',
                'Direct substance',
                'Episodicity',
                'Finding context',
                'Finding informer',
                'Finding method',
                'Finding site',
                'Has active ingredient',
                'Has definitional manifestation',
                'Has dose form',
                'Has focus',
                'Has intent',
                'Has interpretation',
                'Has specimen',
                'Indirect device',
                'Indirect morphology',
                'Interprets',
                'Laterality',
                'Measurement method',
                'Method',
                'Occurrence',
                'Pathological process',
                'Priority',
                'Procedure context',
                'Procedure device',
                'Procedure morphology',
                'Procedure site',
                'Procedure site - Direct',
                'Procedure site - Indirect',
                'Property',
                'Recipient category',
                'Revision status',
                'Route of administration',
                'Scale type',
                'Severity',
                'Specimen procedure',
                'Specimen source identity',
                'Specimen source morphology',
                'Specimen source topography',
                'Specimen substance',
                'Subject of information',
                'Subject relationship context',
                'Surgical approach',
                'Temporal context',
                'Time aspect',
                'Type of',
                'Using device',
                'Using access device',
                'Using energy',
                'Using substance'
            ];

            // Destination Terminology
            metadata[REQUEST_METADATA_KEY.DESTINATION_TERMINOLOGY] = [
                'SNOMED CT International',
                'SNOMED CT Canadian Extension'
            ];

			metadata[REQUEST_METADATA_KEY.DESTINATION_TERMINOLOGY].sort(function(a, b) {
				return utilsService.compareStrings(a, b);
			});
			
            // Characteristic Types
            metadata[REQUEST_METADATA_KEY.CHARACTERISTIC_TYPE] = [
                'Defining relationship',
                'Qualifying relationship',
                'Additional relationship'
            ];
			
			metadata[REQUEST_METADATA_KEY.CHARACTERISTIC_TYPE].sort(function(a, b) {
				return utilsService.compareStrings(a, b);
			});

            // Refinabilities
            metadata[REQUEST_METADATA_KEY.REFINABILITY] = [
                'Not refinable',
                'Optional',
                'Mandatory'
            ];

			metadata[REQUEST_METADATA_KEY.REFINABILITY].sort(function(a, b) {
				return utilsService.compareStrings(a, b);
			});
			
            // Concept History Attributes
            metadata[REQUEST_METADATA_KEY.CONCEPT_HISTORY_ATTRIBUTE] = [
                'Maybe a',
                'Moved From',
                'Moved To',
                'Replaced By',
                'Same As',
                'Was a'
            ];
			
			metadata[REQUEST_METADATA_KEY.CONCEPT_HISTORY_ATTRIBUTE].sort(function(a, b) {
				return utilsService.compareStrings(a, b);
			});

            // New Concept Statuses
            metadata[REQUEST_METADATA_KEY.NEW_CONCEPT_STATUS] = [
                // 'Active',
                // 'Inactivate without a stated reason',
                // 'Duplicate',
                // 'Outdated',
                // 'Erroneous',
                // 'Limited',
                // 'Inappropriate',
                // 'Concept inactive',
                // 'Moved elsewhere'
                'Ambiguous',
                'Duplicate',
                'Erroneous',
                'Limited',
                'Moved elsewhere',
                'Outdated',
                'Pending move',
                'Retired'
            ];

			metadata[REQUEST_METADATA_KEY.NEW_CONCEPT_STATUS].sort(function(a, b) {
				return utilsService.compareStrings(a, b);
			});
            
            // component inactivation metadata
            metadata[REQUEST_METADATA_KEY.CONCEPT_INACTIVATION_REASON] = [
                {text: 'Ambiguous', display: [4]},
                {text: 'Moved elsewhere', display: [3]},
                {text: 'Duplicate', display: [7]},
                {text: 'Erroneous', display: [6]},
                {text: 'Limited', display: [9]},
                {text: 'Outdated', display: [6]},
                {text: 'Non-conformance to editorial policy', display: []}                
            ];
            
            metadata[REQUEST_METADATA_KEY.ASSOCIATION_INACTIVATION_REASON] =
                [
                {text: 'Moved From', display: 2},
                {text: 'Moved To', display: 3},
                {text: 'Possibly Equivalent To',display: 4},
                {text: 'Refers To',display: 5},
                {text: 'Replaced By', display: 6},
                {text: 'Same As',display: 7},
                {text: 'Similar To', display: 8},
                {text: 'Was a', display: 9}
            ];            

            // New Description Statuses
            metadata[REQUEST_METADATA_KEY.NEW_DESCRIPTION_STATUS] = [
                'Ambiguous',
                'Duplicate',
                'Erroneous',
                'Limited',
                'Moved elsewhere',
                'Outdated',
                'Pending move',
                'Retired'
            ];

            metadata[REQUEST_METADATA_KEY.DESCRIPTION_INACTIVATION_REASON] = [
                {text: 'Not Semantically Equivalent', display: [5]},
                {text: 'Outdated', display: []},
                {text: 'Erroneous', display: []},
                {text: 'Non-conformance to editorial policy', display: []}          
            ];

			metadata[REQUEST_METADATA_KEY.NEW_DESCRIPTION_STATUS].sort(function(a, b) {
				return utilsService.compareStrings(a, b);
			});
			
            // New Relationship Statuses
            metadata[REQUEST_METADATA_KEY.NEW_RELATIONSHIP_STATUS] = [
                'Ambiguous',
                'Duplicate',
                'Erroneous',
                'Limited',
                'Moved elsewhere',
                'Outdated',
                'Pending move',
                'Retired'
            ];

			metadata[REQUEST_METADATA_KEY.NEW_RELATIONSHIP_STATUS].sort(function(a, b) {
				return utilsService.compareStrings(a, b);
			});
			
            var getMetadata = function (metadataKeys) {
                var deferred = $q.defer(),
                    keyArray,
                    rtMetadata = {};

                if (metadataKeys === undefined || metadataKeys === null) {
                    rtMetadata = angular.copy(metadata);
                } else {
                    if (angular.isString(metadataKeys)) {
                        keyArray = [metadataKeys];
                    } else if (angular.isArray(metadataKeys)) {
                        keyArray = metadataKeys;
                    }

                    angular.forEach(metadataKeys, function (key) {
                        if (angular.isString(key) && metadata.hasOwnProperty(key)) {
                            rtMetadata[key] = angular.copy(metadata[key]);
                        }
                    });
                }

                deferred.resolve(rtMetadata);

                return deferred.promise;
            };

            return {
                getMetadata: getMetadata
            };

        }]);