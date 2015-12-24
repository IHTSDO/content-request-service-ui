'use strict';

angular
    .module('conceptRequestServiceApp.error')
    .factory('errorHandlerService', [
        'ERROR_TYPE',
        'CUSTOM_ERROR_DEF',
        function (ERROR_TYPE, CUSTOM_ERROR_DEF) {
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

            var buildHttpError = function (httpErrorResponse, errorStatus) {
                if (angular.isObject(httpErrorResponse) && angular.isDefined(httpErrorResponse.errorCode)) {
                    return angular.extend({
                            type: ERROR_TYPE.CUSTOM
                        },
                        findErrorDef(httpErrorResponse));
                }

                return {
                    type: ERROR_TYPE.HTTP,
                    code: errorStatus,
                    message: 'Cannot connect to server.'
                };

            };

            return {
                buildCustomError: buildCustomError,
                buildHttpError: buildHttpError
            };
        }
    ]);