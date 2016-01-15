'use strict';
angular
    .module('conceptRequestServiceApp.taxonomy')
    .directive('taxonomyTree', [
        '$rootScope',
        '$q',
        'snowowlService',
        'TAXONOMY_ROOT_NODE',
        function ($rootScope, $q, snowowlService, TAXONOMY_ROOT_NODE) {
            return {
                restrict: 'A',
                transclude: false,
                replace: true,
                scope: {
                    concept: '=?',
                    limit: '@?'
                },
                templateUrl: 'shared/taxonomy/taxonomy-tree.html',

                link: function (scope) {
                    var paths = {};
                    var parentsCache = [];
                    var nodes = {};
                    var treesStarted = 1; // the original node
                    var treesDone = 0;

                    // set default limit if not specified (unlimited)
                    if (!scope.limit) {
                        scope.limit = -1;
                    }

                    // The root concepts for display
                    // NOTE: Must be array (even though SNOMEDCT only has 1 root)
                    scope.terminologyTree = [];

                    /**
                     * Drag and drop object
                     * @param conceptId the concept to be dragged
                     * @returns {{id: *, name: null}}
                     */
                    scope.getConceptPropertiesObj = function (concept) {
                        //console.debug('Getting concept properties obj', concept);
                        return {id: concept.id, name: concept.fsn};
                    };

                    /**
                     * Gets and sets the children for a tree node
                     * @param node The parent node
                     */
                    scope.getAndSetChildren = function (node) {
                        snowowlService.getConceptChildren(null, null, node.conceptId).then(function (children) {
                                if (!children) {
                                    console.error('Could not retrieve children for node', node);
                                    return;
                                }

                                angular.forEach(children, function (child) {
                                    child.isCollapsed = true;
                                });

                                node.children = children;
                                node.isCollapsed = false;

                            },

                            function () {
                                console.error('Could not retrieve children for node', node);
                            }
                        );
                    };

                    scope.getProgress = function () {
                        return parseInt(treesDone / treesStarted * 100);
                    };

                    function mergeTrees() {
                        var rootConceptId = TAXONOMY_ROOT_NODE.conceptId;
                        var rootNode, firstNode;

                        angular.forEach(nodes, function (node) {
                            //console.debug('constructing node', node);
                            node.children = [];

                            angular.forEach(paths[node.conceptId], function (path) {
                                node.children.push(nodes[path]);
                            });
                            if (node.conceptId === scope.concept.conceptId) {
                                node.isCollapsed = true;
                            }

                            if (firstNode === undefined || firstNode === null) {
                                firstNode = node;
                            }
                        });

                        rootNode = nodes[rootConceptId];

                        if (rootNode !== undefined && rootNode !== null) {
                            scope.terminologyTree.push(rootNode);
                        } else if (firstNode !== undefined && firstNode !== null) {
                            scope.terminologyTree.push(firstNode);
                        }
                    }

                    function addPathSegment(start, finish) {
                        //  //console.debug('adding path', start, finish, paths);
                        if (!paths[start]) {
                            paths[start] = [];
                        }

                        if (paths[start].indexOf(finish) === -1) {
                            paths[start].push(finish);
                        }

                        //  //console.debug('new paths', paths);
                    }

                    function getParentsHelper(node) {
                        var deferred = $q.defer();

                        if (parentsCache[node.conceptId]) {
                            deferred.resolve(parentsCache[node.conceptId]);
                        } else {
                            // get all parents
                            snowowlService.getConceptParents(null, null, node.conceptId).then(function (parents) {
                                parentsCache[node.conceptId] = parents;
                                deferred.resolve(parents);
                            });
                        }
                        return deferred.promise;
                    }

                    // NOTE: Path is only for debugging
                    scope.constructRootTreesHelper = function (node, path, limit) {

                        //console.debug('constructing tree for path/node', path, node);

                        // check if this node is stored
                        if (!nodes.hasOwnProperty(node.conceptId)) {
                            nodes[node.conceptId] = node;
                        }

                        // get all parents
                        getParentsHelper(node).then(function (parents) {

                            //console.debug('parents for ', node.conceptId, parents);

                            // if root, check if all started tree computations are complete
                            if (!parents || parents.length === 0) {
                                treesDone++;
                                //console.debug('treesDone/treesStarted', treesDone,
                                // treesStarted);
                                if (treesDone === treesStarted) {
                                    mergeTrees();
                                }
                            }

                            else {

                                var nEligibleParents;
                                if (limit === -1) {
                                    //console.debug('unlimited parents');
                                    nEligibleParents = parents.length;
                                    treesStarted += parents.length - 1;
                                } else {
                                    //console.debug('limited parents');
                                    nEligibleParents = limit - treesStarted + 1;
                                    treesStarted += Math.min(nEligibleParents, parents.length) - 1;
                                }

                                //console.debug('limit/started/done/eligible', scope.limit,
                                // treesStarted, treesDone, nEligibleParents);

                                // add path and recursively call on parents
                                for (var i = 0; i < nEligibleParents && i < parents.length; i++) {
                                    //console.debug(i, parents[i]);
                                    addPathSegment(parents[i].conceptId, node.conceptId);
                                    scope.constructRootTreesHelper(parents[i], parents[i].conceptId + '~' + path, limit);
                                }

                            }
                        });
                    };

                    scope.constructRootTrees = function (node) {
                        scope.constructRootTreesHelper(node, node.conceptId, scope.limit);
                    };

                    scope.toggleNode = function (node, nodeScope) {
                        // check that node has children
                        if (node.isLeafInferred) {
                            return;
                        }

                        // toggle state of the node
                        nodeScope.toggle();

                        // if node open, has children, but no children loaded
                        if (!nodeScope.collapsed && !node.isLeafInferred && (!node.children || node.children.length === 0)) {
                            scope.getAndSetChildren(node);
                        }

                    };

                    scope.getTreeNodeIcon = function (node, collapsed) {
                        if (node.isLeafInferred) {
                            return 'glyphicon glyphicon-minus';
                        } else if (collapsed) {
                            return 'glyphicon glyphicon-chevron-right';
                        } else {
                            return 'glyphicon glyphicon-chevron-down';
                        }
                    };

                    function initialize() {

                        // if a concept is supplied
                        // TODO: Improve this such that ng-ifs not required on parent div (i.e. no concept renders  taxonomy)
                        if (scope.concept) {
                            scope.constructRootTrees(scope.concept);
                        } else { // if concept id not specified, use root
                            var parent = angular.copy(TAXONOMY_ROOT_NODE);
                            // get the children
                            scope.getAndSetChildren(parent);

                            // add as root tree
                            scope.terminologyTree.push(parent);
                        }
                    }

                    // call initialization
                    initialize();
                }
            };
        }]
);