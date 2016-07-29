'use strict';

angular
    .module('conceptRequestServiceApp.imsAuthentication')
    .value('LOGIN_STATUS', {
        UNDEFINED: 0,
        LOGGED_IN: 1,
        LOGGED_OUT: 2
    })
    .factory('accountService', [
        'LOGIN_STATUS',
        '$q',
        '$http',
        'configService',
        'CRS_ROLE',
        function (LOGIN_STATUS, $q, $http, configService, CRS_ROLE) {
            var loginStatus = LOGIN_STATUS.UNDEFINED;
            var accountDetails = null;

            var imsApiEndpoint = configService.getEndpointConfig('ims-api');

            var isCredentialChecked = function () {
                return loginStatus !== LOGIN_STATUS.UNDEFINED;
            };

            var isUserLoggedIn = function () {
                return loginStatus === LOGIN_STATUS.LOGGED_IN;
            };

            var getLoginStatus = function () {
                return loginStatus;
            };

            var checkCredential = function () {
                // by re-loading account details
                accountDetails = null;

                return getAccountInfo().then(function () {
                    if (accountDetails === null) {
                        loginStatus = LOGIN_STATUS.LOGGED_OUT;
                    } else {
                        loginStatus = LOGIN_STATUS.LOGGED_IN;
                    }
                }, function () {
                    loginStatus = LOGIN_STATUS.LOGGED_OUT;
                });
            };

            var getAccountInfo = function () {
                var getAccountAPI = 'account';
                var deferred = $q.defer();

                if (accountDetails !== undefined &&
                    accountDetails !== null) {
                    deferred.resolve(accountDetails);
                    return deferred.promise;
                }

                return $http.get(imsApiEndpoint + getAccountAPI, {withCredentials: true})
                    .then(function (response) {
                        accountDetails = response.data;
                        return response.data;
                    }, function () {
                        accountDetails = null;
                    });
            };

            var checkRoles = function (roles) {
                return getAccountInfo().then(function () {
                    var userRoles = accountDetails.roles;
                    var rs = false;

                    if (angular.isArray(userRoles) && userRoles.length > 0) {
                        if (angular.isString(roles)) {
                            rs = (userRoles.indexOf(roles) !== -1);
                        } else if (angular.isArray(roles) && roles.length > 0) {
                            for (var i = 0; i < userRoles.length; i++) {
                                if (userRoles.indexOf(roles[i]) !== -1) {
                                    rs = true;
                                    break;
                                }
                            }
                        }
                    }

                    return rs;
                });
            };
            var checkUserPermission = function () {
                return checkRoles([CRS_ROLE.ADMINISTRATOR, CRS_ROLE.MANAGER]).then(function (adminRs) {
                    if (adminRs === true) {
                        return {
                            isAdmin: true
                        };
                    } else {
                        return checkRoles([CRS_ROLE.STAFF]).then(function (staffRs) {
                            if(staffRs === true){
                                return {
                                    isStaff: true
                                }; 
                            }else{
                                return checkRoles([CRS_ROLE.REQUESTOR, CRS_ROLE.PARTNER, CRS_ROLE.MEMBER]).then(function (requestorRs) {
                                    if(requestorRs === true){
                                        return {
                                            isRequester: true
                                        }; 
                                    }else{
                                        return checkRoles([CRS_ROLE.VIEWER]).then(function (viewerRs) {
                                            return {
                                                isViewer: viewerRs
                                            };
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            };


            var getUserPreferences = function () {
                var deferred = $q.defer();
                var mockedUserPref = {};

                deferred.resolve(mockedUserPref);

                return deferred.promise;
            };

            var applyUserPreferences = function () {
                var deferred = $q.defer();
                var mockedUserPref = {};

                deferred.resolve(mockedUserPref);

                return deferred.promise;
            };

            return {
                isCredentialChecked: isCredentialChecked,
                checkCredential: checkCredential,
                isUserLoggedIn: isUserLoggedIn,
                getLoginStatus: getLoginStatus,
                getAccountInfo: getAccountInfo,
                getUserPreferences: getUserPreferences,
                applyUserPreferences: applyUserPreferences,
                checkRoles: checkRoles,
                checkUserPermission: checkUserPermission,

                getTestUsers: function () {
                    return $http.get('http://local.ihtsdotools.org/crs/api/test/user', {withCredentials: true})
                        .success(function (data) {
                            accountDetails = data;
                        })
                        .error(function () {
                            accountDetails = null;
                        });
                }
            };
        }
    ]);