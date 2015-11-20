'use strict';

angular
    .module('conceptRequestServiceApp.snowowl')
    .service('snowowlMetadataService', [
        'snowowlService',
        function (snowowlService) {

            // relationship metadata
            var isaRelationshipId = '116680003';

            // component inactivation metadata
            var componentInactivationReasons = [];
            // var inactivationParent = '900000000000481005';
            var associationInactivationReasons = [];
            // var associationInactivationParent = '900000000000522004';

            var baseModules = [
                '900000000000207008', '900000000000012004'
            ];

            var baseLanguages = ['en'];

            var baseDialects = ['en-us', 'en-gb'];

            var modules = [];
            var languages = [];
            var dialects = [];

            /**
             * Sets the static array of concept inactivation reasons
             */
            function setInactivationReasons() {


                // set the inactivation reasons with combination of enum values and
                // preferred terms
                componentInactivationReasons = [
                    {id: 'AMBIGUOUS', text: 'Ambiguous component'},
                    {id: 'MOVED_ELSEWHERE', text: 'Component moved elsewhere'},
                    {id: 'DUPLICATE', text: 'Duplicate component'},
                    {id: 'ERRONEOUS', text: 'Erroneous component'},
                    {id: 'LIMITED', text: 'Limited component'},
                    {id: 'OUTDATED', text: 'Outdated component'},
                    {id: 'PENDING_MOVE', text: 'Pending move'},
                    {id: 'RETIRED', text: 'Reason not stated'}
                ];

                /*
                 NOTE: Cannot use this, as SnowOwl does not use SNOMEDCT concept, but rather abbreviation
                 snowowlService.getConceptRelationshipsInbound(inactivationParent, branch, 0, -1).then(function (items) {
                 items.inboundRelationships.filter(function (item) {
                 return item.characteristicType === 'STATED_RELATIONSHIP' && item.type.id === isaRelationshipId;
                 }).map(function(item) {
                 componentInactivationReasons.push({conceptId : item.source.id, fsn : item.source.fsn});
                 })
                 }); */
            }

            /**
             * Sets the static array of association inactivation reasons
             */
            function setAssociationInactivationReasons() {

                associationInactivationReasons =
                    [
                        {
                            id: 'ALTERNATIVE',
                            text: 'ALTERNATIVE association reference set'
                        },
                        {
                            id: 'MOVED_FROM',
                            text: 'MOVED FROM association reference set'
                        },
                        {
                            id: 'MOVED_TO',
                            text: 'MOVED TO association reference set'
                        },
                        {
                            id: 'POSSIBLY_EQUIVALENT_TO',
                            text: 'POSSIBLY EQUIVALENT TO association reference set'
                        },
                        {
                            id: 'REFERS_TO',
                            text: 'REFERS TO concept association reference set'
                        },
                        {
                            id: 'REPLACED_BY',
                            text: 'REPLACED BY association reference set'
                        },
                        {
                            id: 'SAME_AS',
                            text: 'SAME AS association reference set'
                        },
                        {
                            id: 'SIMILAR_TO',
                            text: 'SIMILAR TO association reference set'
                        },
                        {
                            id: 'WAS_A',
                            text: 'WAS A association reference set'
                        }
                    ];

                /*
                 NOTE: Cannot use this, as SnowOwl does not use SNOMEDCT concept, but rather abbreviation

                 snowowlService.getConceptRelationshipsInbound(associationInactivationParent, branch, 0, -1).then(function (items) {
                 items.inboundRelationships.filter(function (item) {
                 return item.characteristicType === 'STATED_RELATIONSHIP' && item.type.id === isaRelationshipId;
                 }).map(function(item) {
                 associationInactivationReasons.push({conceptId : item.source.id, fsn : item.source.fsn});
                 })
                 });*/
            }

            // function to initialize/add to stored module names
            // arg: moduleIds, array of module SCTIDs
            // arg: branch, module branch
            function addModules(moduleIds) {
                var snowowlConfig = snowowlService.getSnowowlConfig();

                moduleIds.map(function (moduleId) {
                    var module = {};

                    // get the term, then add the module
                    snowowlService.getFullConcept(null, null, moduleId).then(function (response) {
                        module.id = moduleId;
                        module.branch = snowowlConfig.edition;
                        module.name = response.fsn;

                        // console.log('Added module', module);

                        modules.push(module);
                    });

                });
            }

            // function to retrieve all module id/name pairs
            function getModules() {
                return modules;
            }

            // add new language options
            // TODO:  Currently unused, language options are extracted from dialects
            function addLanguages(newLanguages) {
                languages = languages.concat(newLanguages);
                // console.log('Language Options set to', languages);
            }

            // get language options
            // TODO:  Currently unused, language options are extracted from dialects
            function getLanguages() {
                return languages;
            }

            // add new dialect options
            function addDialects(newDialects) {
                dialects = dialects.concat(newDialects);
                // console.debug('Dialect options set to: ', dialects);
            }

            // get dialect options
            function getDialects() {
                return dialects;
            }

            /**
             * Initializes all required metadata for a specified branch. Run at
             * application start.
             * @param branch the branch from which metadata is retrieved (e.g.
             *   'MAIN')
             */
            function initialize() {
                setInactivationReasons();
                setAssociationInactivationReasons();

                addModules(baseModules);
                addLanguages(baseLanguages);
                addDialects(baseDialects);
            }

            initialize();

            return {

                /**
                 * Returns true if typeId matches that specified for IsA relationship.
                 * @param typeId the typeId
                 * @returns {boolean} true if equal, false if not
                 */
                isIsaRelationship: function (typeId) {
                    return typeId === isaRelationshipId;
                },

                /**
                 * Gets the concept inactivation reasons.
                 * @returns {Array} the concept inactivation reasons
                 */
                getComponentInactivationReasons: function () {
                    return componentInactivationReasons;
                },

                /**
                 * Gets the association inactivation reasons.
                 * @returns {Array} the association inactivation reasons
                 */
                getAssociationInactivationReasons: function () {
                    return associationInactivationReasons;
                },

                getModules: getModules,
                getLanguages: getLanguages,
                getDialects: getDialects
            };

        }]
    );
