'use strict';

angular
    .module('conceptRequestServiceApp.error')
    .factory('errorHandlerService', [
        '$q',
        '$location',
        'notificationService',
        'ERROR_TYPE',
        'CUSTOM_ERROR_DEF',
        'HTTP_ERROR_DEF',
        function ($q, $location, notificationService, ERROR_TYPE, CUSTOM_ERROR_DEF, HTTP_ERROR_DEF) {
            var findErrorDef = function (error) {
                var errorCode = error.errorCode;
                var errorDef = {
                    code: error.errorCode,
                    message: error.message
                };

                for (var errorKey in CUSTOM_ERROR_DEF) {
                    if (CUSTOM_ERROR_DEF.hasOwnProperty(errorKey) &&
                        CUSTOM_ERROR_DEF[errorKey].code === errorCode) {
                        errorDef = angular.copy(CUSTOM_ERROR_DEF[errorKey]);
                        break;
                    }
                }

                return errorDef;
            };


            var buildCustomError = function (error) {
                return angular.extend({
                        type: ERROR_TYPE.CUSTOM
                    },
                    findErrorDef(error));
            };

            var identifyHttpErrorObject = function (httpErrorCode, httpErrorResponse) {
                var UNKNOWN_ERROR = {
                    code: httpErrorCode,
                    message: 'Internal server error.'
                };

                for (var httpErrorKey in HTTP_ERROR_DEF) {
                    if (HTTP_ERROR_DEF.hasOwnProperty(httpErrorKey) &&
                        HTTP_ERROR_DEF[httpErrorKey].code === httpErrorCode) {
                        return HTTP_ERROR_DEF[httpErrorKey];
                    }
                }

                return UNKNOWN_ERROR;
            };

            var isUnauthorizeError = function (httpErrorObject) {
                return (httpErrorObject === HTTP_ERROR_DEF.UNAUTHORIZED ||
                    httpErrorObject === HTTP_ERROR_DEF.FORBIDDEN)
            };

            var handleUnauthorizeHttpError = function (httpErrorObject) {
                switch(httpErrorObject) {
                    case HTTP_ERROR_DEF.UNAUTHORIZED:
                        $location.path('/login');
                        break;
                    case HTTP_ERROR_DEF.FORBIDDEN:
                        notificationService.sendError('You are not allowed to access this page', 5000, null, true);
                        if ($location.path() !== '/dashboard') {
                            $location.path('/dashboard');
                        }

                        break;
                    default:
                        break;
                }
            };

            var buildHttpError = function (httpErrorResponse, errorStatus) {
                var httpErrorObject = identifyHttpErrorObject(errorStatus, httpErrorResponse);

                if (angular.isObject(httpErrorResponse) && angular.isDefined(httpErrorResponse.errorCode)) {
                    return angular.extend({
                            type: ERROR_TYPE.CUSTOM
                        },
                        findErrorDef(httpErrorResponse));
                }

                if (isUnauthorizeError(httpErrorObject)) {
                    handleUnauthorizeHttpError(httpErrorObject);
                }

                return angular.extend({
                    type: ERROR_TYPE.HTTP
                }, httpErrorObject);

            };

            return {
                buildCustomError: buildCustomError,
                buildHttpError: buildHttpError
            };
        }
    ]);