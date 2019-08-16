/*jshint sub:true*/
'use strict';

angular.module('conceptRequestServiceApp.snowowl')
    .provider('snowowlService', function () {
        var provider = this;
        var config, snowowlEndpoint, useAdapter;

        provider.setSnowowlEndpoint = function (endpoint) {
            snowowlEndpoint = endpoint;
        };

        provider.setUseAdapter = function(adapter) {
           useAdapter = adapter;
        };

        provider.config = function (snowowlConfig) {
            config = snowowlConfig;
        };

        provider.$get = [
            '$http',
            '$q',
            'SNOWOWL_API',
            'SNOWOWL_TARGET',
            'SNOWOWL_BASIC_AUTHORIZATION',
            function ($http, $q, SNOWOWL_API, SNOWOWL_TARGET, SNOWOWL_BASIC_AUTHORIZATION) {

                var getSnowowlEndpointUrl = function (method, projectKey, taskKey, target, param) {

                    var url = snowowlEndpoint + config.path + ((method !== undefined && method !== null)?(method + '/'):'') + config.edition;

                    if (config.release) {
                        url += '/' + config.release;
                    }
                    if (projectKey) {
                        url += '/' + projectKey;
                    }
                    if (taskKey) {
                        url += '/' + taskKey;
                    }

                    url += '/' + target;

                    if (param !== undefined && param !== null) {
                        url += '/' + param;
                    }

                    return url;
                };

                var sendRequest = function (request) {
                    request.withCredentials = true;
                    if (request.headers === undefined || request.headers === null) {
                        request.headers = {};
                    }

                    request.headers['Authorization'] = SNOWOWL_BASIC_AUTHORIZATION;


                    return $http(request);

                    /*return $http.get(request.url, {
                        withCredentials: true,
                        headers: {Authorization: SNOWOWL_BASIC_AUTHORIZATION},
                        params: request.params,
                        data:request.data
                    });*/
                };

                var sendSnowowlRequest = function (httpMethod, apiMethod, projectKey, taskKey, apiTarget, pathParam, params, data) {
                    var url = getSnowowlEndpointUrl(apiMethod, projectKey, taskKey, apiTarget, pathParam);

                    return sendRequest({
                        method: httpMethod,
                        url: url,
                        params: params,
                        data: data
                    });
                };

                var detectTarget = function (searchStr) {
                    var indicatorChar = searchStr.substr(-2, 1);

                    for (var targetKey in SNOWOWL_TARGET) {
                        if (SNOWOWL_TARGET.hasOwnProperty(targetKey) &&
                            SNOWOWL_TARGET[targetKey].indicator === indicatorChar) {
                            return SNOWOWL_TARGET[targetKey];
                        }
                    }

                    return null;
                };

                var buildSearchResultConceptItem = function (response) {
                    var fsn = response.data.fsn;
                    if(response.data.fsn instanceof Object) {
                        fsn = response.data.fsn.term;
                    }
                    return {
                        active: response.data.active,
                        term: response.data.preferredSynonym,
                        concept: {
                            active: response.data.active,
                            conceptId: response.data.conceptId,
                            definitionStatus: response.data.definitionStatus,
                            fsn: fsn,
                            moduleId: response.data.moduleId
                        }
                    };
                };

                var getSnowowlConfig = function () {
                    return config;
                };

                var getDomainAttributes = function (projectKey, taskKey, parentIds) {
                    var params = {
                        parentIds: parentIds,
                        expand: 'fsn()',
                        offset: 0,
                        limit: 50
                    };

                    return sendSnowowlRequest('GET', SNOWOWL_API.MRCM, projectKey, taskKey, SNOWOWL_TARGET.DOMAIN_ATTRIBUTE.path, null, params, null)
                        .then(function (response) {
                            return response.data ? response.data : [];
                        }, function () {
                            return null;
                        });
                };

                var getDomainAttributeValues = function (projectKey, taskKey, attributeId, searchStr) {
                    var params = {
                        expand: 'fsn()',
                        offset: 0,
                        limit: 50
                    };

                    if (searchStr) {
                        if (isNaN(parseFloat(searchStr) || !isFinite(searchStr))) {
                            searchStr += '*';
                        }

                        params.termPrefix = searchStr;
                    }

                    return sendSnowowlRequest('GET', SNOWOWL_API.MRCM, projectKey, taskKey, SNOWOWL_TARGET.DOMAIN_ATTRIBUTE_VALUE.path, attributeId, params, null)
                        .then(function (response) {
                            return (response.data && response.data.items) ? transformConceptAttributeValues(response.data.items) : [];
                        }, function () {
                            return null;
                        });
                };

                var findConcepts = function (projectKey, taskKey, searchStr, offset, maxResults) {
                    var deferred = $q.defer();
                    var snowowlTarget, apiMethod, searchParams;

                    // ensure & not present in search string, to prevent bad requests
                    // TODO Decide how we want to handle validation of user search requests
                    if (searchStr.indexOf('&') !== -1) {
                        deferred.reject('Character "&" cannot appear in search terms; please remove and try again.');
                    } else if (!isNaN(parseFloat(searchStr)) && isFinite(searchStr)) { // if a numeric value, search by component id
                        snowowlTarget = detectTarget(searchStr);

                        if (snowowlTarget !== undefined && snowowlTarget !== null) {
                            if (snowowlTarget === SNOWOWL_TARGET.CONCEPT) {
                                apiMethod = SNOWOWL_API.BROWSER;
                            }

                            sendSnowowlRequest('GET', apiMethod, null, null, snowowlTarget.path, searchStr, null, null)
                                .then(function (response) {
                                    var conceptSearchStr;

                                    switch (snowowlTarget) {
                                        case SNOWOWL_TARGET.CONCEPT:
                                            deferred.resolve([ buildSearchResultConceptItem(response) ]);
                                            break;
                                        case SNOWOWL_TARGET.DESCRIPTION:
                                        case SNOWOWL_TARGET.RELATIONSHIP:
                                            conceptSearchStr = ((snowowlTarget === SNOWOWL_TARGET.DESCRIPTION)? response.data.conceptId : response.data.sourceId);
                                            sendSnowowlRequest('GET', SNOWOWL_API.BROWSER, null, null, SNOWOWL_TARGET.CONCEPT.path, conceptSearchStr, null, null)
                                                .then(function (conceptResponse) {
                                                    deferred.resolve([ buildSearchResultConceptItem(conceptResponse) ]);
                                                }, function (error) {
                                                    deferred.reject(error);
                                                });
                                            break;
                                    }
                                }, function (error) {
                                    deferred.reject(error);
                                });
                        } else {
                            deferred.reject('Could not parse numeric value (not a concept, description, or relationship SCTID)');
                        }
                    } else { // otherwise, a text value, search by query
                        searchParams = {
                            query: searchStr,
                            term: searchStr,
                            limit: maxResults,
                            searchAfter: offset !== 0 ? offset : ''
                        };

                        sendSnowowlRequest('GET', SNOWOWL_API.BROWSER, null, null, SNOWOWL_TARGET.DESCRIPTION.path, null, searchParams, null)
                            .then(function (response) {
                                deferred.resolve(response.data);
                            }, function (error) {
                                if (error.status === 500) {
                                    deferred.reject('Unexpected server error.  Please check your search terms and try again.');
                                } else {
                                    deferred.reject(error.data.message + ' (Status ' + error.status + ')');
                                }
                            });
                    }

                    return deferred.promise;
                };

                function getFullConcept(projectKey, taskKey, conceptId) {
                    return sendSnowowlRequest('GET', SNOWOWL_API.BROWSER, projectKey, taskKey, SNOWOWL_TARGET.CONCEPT.path, conceptId, null, null)
                        .then(function (response) {
                            return transformConceptSnowowlToSnowstorm(response.data);
                        });
                }

                var getConceptParents = function (projectKey, taskKey, conceptId) {
                    return sendSnowowlRequest('GET', SNOWOWL_API.BROWSER, projectKey, taskKey, SNOWOWL_TARGET.CONCEPT.path, conceptId + '/parents', null, null)
                        .then(function (response) {
                            return transformConceptSnowowlToSnowstorm(response.data);
                        });
                };

                var getConceptChildren = function (projectKey, taskKey, conceptId) {
                    return sendSnowowlRequest('GET', SNOWOWL_API.BROWSER, projectKey, taskKey, SNOWOWL_TARGET.CONCEPT.path, conceptId + '/children', null, null)
                        .then(function (response) {
                            return transformConceptSnowowlToSnowstorm(response.data);
                        });
                };


                var transformConceptAttributeValues = function (data) {
                   if(useAdapter) {
                      if(data) {
                         if(Array.isArray(data)) {
                            data.forEach(transformConceptAttributeValue);
                         } else {
                            transformConceptAttributeValue(data);
                         }
                      }
                   }
                   return data;
                };

                var transformConceptAttributeValue = function (item) {
                    if(item && item.fsn && !item.fsn.conceptId) {
                        item.fsn.conceptId = item.id;
                    }
                };

                var transformConceptSnowowlToSnowstorm = function(data) {
                   if(useAdapter) {
                      if(data) {
                         if(Array.isArray(data)) {
                            data.forEach(transformConcept);
                         } else {
                            transformConcept(data);
                         }
                      }
                   }
                    return data;
                };

                var transformConcept = function(item) {
                    if(item && item.fsn instanceof Object) {
                        item.fsn = item.fsn.term;
                        if(item.pt) {
                           item.preferredSynonym = item.pt.term;
                        } else if(item.preferredSynonym instanceof Object) {
                           item.preferredSynonym = item.preferredSynonym.term;
                        }
                        if(item.classAxioms) {
                            var newRelationships = [];
                            for(var i=0;i< item.classAxioms.length;i++) {
                                if(item.classAxioms[i].active) {
                                    var snowStormRelationships = item.classAxioms[i].relationships;
                                    for(var j=0;j<snowStormRelationships.length;j++) {
                                        newRelationships.push(convertRelationshipSnowstormToSnowowl(snowStormRelationships[j], true));
                                    }
                                }
                            }
                            for(i=0;i< item.relationships.length;i++) {
                                if(item.relationships[i].characteristicType == 'INFERRED_RELATIONSHIP') {
                                   newRelationships.push(convertRelationshipSnowstormToSnowowl(item.relationships[i], false));
                                }
                            }
                            item.relationships = newRelationships;
                        }
                    } else if(item && item.concept && item.concept.fsn instanceof Object) {
                        item.concept.fsn = item.concept.fsn.term;
                    }
                    delete item.pt;
                    delete item.classAxioms;
                    delete item.gciAxioms;
                };

                var convertRelationshipSnowstormToSnowowl = function(relationship, isAxiom) {
                   var convertedRelationship = relationship;
                   if(isAxiom) {
                      convertedRelationship.relationshipId = relationship.sourceId + "_" + relationship.target.conceptId + "_" + relationship.type.conceptId;
                   }
                   convertedRelationship.target = {
                      conceptId: relationship.target.conceptId,
                      fsn: relationship.target.fsn.term,
                      definitionStatus: relationship.definitionStatus
                   };
                   convertedRelationship.type = {
                     fsn: relationship.type.fsn.term,
                     pt: relationship.type.pt.term,
                     conceptId: relationship.type.conceptId
                   };
                   return convertedRelationship;
               };




                var getConceptDescendants = function (projectKey, taskKey, conceptId, offset, limit) {
                    var params;

                    // default values
                    if (!offset) {
                        offset = 0;
                    }
                    if (!limit) {
                        limit = 50;
                    }
                    if (limit > 200) {
                        limit = 200;
                    }

                    params = {
                        expand: 'fsn',
                        limit: (limit !== -1 )?limit:null,
                        offset: (offset !== -1 )?offset:null,
                        direct: false
                    };

                    return sendSnowowlRequest('GET', SNOWOWL_API.BROWSER, projectKey, taskKey, SNOWOWL_TARGET.CONCEPT.path, conceptId + '/descendants', params, null)
                        .then(function (response) {
                            return transformConceptSnowowlToSnowstorm(response.data);
                        });
                };

                var getConceptRelationshipsInbound = function (projectKey, taskKey, conceptId, offset, limit) {
                    var params;

                    if (!offset) {
                        offset = 0;
                    }

                    if (!limit) {
                        limit = 50;
                    }

                    params = {
                        expand: 'source.fsn,type.fsn',
                        limit: (limit !== -1 )?limit:null,
                        offset: (offset !== -1 )?offset:null
                    };

                    return sendSnowowlRequest('GET', SNOWOWL_API.BROWSER, projectKey, taskKey, SNOWOWL_TARGET.CONCEPT.path, conceptId + '/inbound-relationships', params, null)
                        .then(function (response) {
                            if (response.data.total === 0) {
                                return {total: 0, inboundRelationships: []};
                            } else {
                                return response.data;
                            }
                        });
                };

                var getConceptRelationshipsOutbound = function (projectKey, taskKey, conceptId) {

                    return sendSnowowlRequest('GET', SNOWOWL_API.BROWSER, projectKey, taskKey, SNOWOWL_TARGET.CONCEPT.path, conceptId + '/outbound-relationships', null, null)
                        .then(function (response) {
                            if (response.data.total === 0) {
                                return [];
                            } else {
                                return response.data.outboundRelationships;
                            }
                        });
                };

                return {
                    getSnowowlConfig: getSnowowlConfig,
                    getDomainAttributes: getDomainAttributes,
                    getDomainAttributeValues: getDomainAttributeValues,
                    findConcepts: findConcepts,
                    getFullConcept: getFullConcept,
                    getConceptChildren: getConceptChildren,
                    getConceptParents: getConceptParents,
                    getConceptDescendants: getConceptDescendants,
                    getConceptRelationshipsInbound: getConceptRelationshipsInbound,
                    getConceptRelationshipsOutbound: getConceptRelationshipsOutbound,
                    transformConceptSnowowlToSnowstorm: transformConceptSnowowlToSnowstorm
                };
            }
        ];
    });
