'use strict';

angular.module('conceptRequestServiceApp.request')
    .service('requestMetadataService', [
        '$q',
        'REQUEST_METADATA_KEY',
        function ($q, REQUEST_METADATA_KEY) {
            var metadata = {};

            // Case Significance
            metadata[REQUEST_METADATA_KEY.CASE_SIGNIFICANCE] = [
                'Entire term case sensitive',
                'Entire term case insensitive',
                'Only initial character case insensitive'
            ];

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
                'Interprets',
                'Laterality',
                'Measurement method',
                'Method',
                'Occurrence',
                'Part of',
                'Pathological process',
                'Priority',
                'Procedure context',
                'Procedure device',
                'Direct device',
                'Indirect device',
                'Using device',
                'Using access device',
                'Procedure morphology',
                'Direct morphology',
                'Indirect morphology',
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
                'Using energy',
                'Using substance'
            ];

            // Characteristic Types
            metadata[REQUEST_METADATA_KEY.CHARACTERISTIC_TYPE] = [
                'Defining relationship',
                'Qualifying relationship',
                'Additional relationship'
            ];

            // Refinabilities
            metadata[REQUEST_METADATA_KEY.REFINABILITY] = [
                'Not refinable',
                'Optional',
                'Mandatory'
            ];

            // Change Concept Status to
            metadata[REQUEST_METADATA_KEY.CHANGE_CONCEPT_STATUS_TO] = [
                'Retired',
                'Duplicate',
                'Outdated',
                'Ambiguous',
                'Erroneous',
                'Limited',
                'Moved elsewhere',
                'Pending move'
            ];

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
                            rtMetadata[key] = angular.copy(metadata[key])
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