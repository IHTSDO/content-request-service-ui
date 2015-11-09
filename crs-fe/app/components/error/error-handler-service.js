'use strict';

angular
    .module('conceptRequestServiceApp.error')
    .factory('errorHandlerService', [
        'ERROR_TYPE',
        'CUSTOM_ERROR_DEF',
        function (ERROR_TYPE, CUSTOM_ERROR_DEF) {
            var findErrorDef = function (errorCode) {
                var errorDef = null;

                for (var errorKey in CUSTOM_ERROR_DEF) {
                    if (CUSTOM_ERROR_DEF.hasOwnProperty(errorKey) &&
                        CUSTOM_ERROR_DEF[errorKey].code === errorCode) {
                        errorDef = angular.copy(CUSTOM_ERROR_DEF[errorKey]);
                        break;
                    }
                }

                return errorDef;
            };


            var buildCustomError = function (errorDef) {
                return angular.extend({
                        type: ERROR_TYPE.CUSTOM
                    },
                    errorDef,
                    findErrorDef(errorDef.code));
            };

            var buildHttpError = function (httpErrorResponse, errorStatus) {
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