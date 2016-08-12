'use strict';

/**
 * @ngdoc overview
 * @name conceptRequestServiceApp
 * @description
 * # conceptRequestServiceApp
 *
 * Main module of the application.
 */
angular
    .module('conceptRequestServiceApp', [
        'ngAnimate',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngRoute',
        'ngSanitize',

        // dependencies
        'ui.bootstrap',
        'ngTable',
        'pascalprecht.translate',
        'angular-loading-bar',
        'ang-drag-drop',
        'ui.tree',
        'ngFileUpload',
        'textAngular',
        'isteven-multi-select',
        'monospaced.elastic',
        'nDaterangepicker',

        // layouts

        // components
        'conceptRequestServiceApp.crs',
        'conceptRequestServiceApp.error',
        'conceptRequestServiceApp.dashboard',
        'conceptRequestServiceApp.userPreferences',
        'conceptRequestServiceApp.request',
        'conceptRequestServiceApp.batch',
        'conceptRequestServiceApp.notification',
        'conceptRequestServiceApp.message',
        'conceptRequestServiceApp.jiraComment',

        // shared
        'conceptRequestServiceApp.imsAuthentication',
        'conceptRequestServiceApp.configuration',
		'conceptRequestServiceApp.utils',
        'conceptRequestServiceApp.formControl',
        'conceptRequestServiceApp.search',
        'conceptRequestServiceApp.conceptInfo',
        'conceptRequestServiceApp.taxonomy',
        'conceptRequestServiceApp.savedList',
        'conceptRequestServiceApp.snowowl',
        'conceptRequestServiceApp.jira',
        'conceptRequestServiceApp.conceptEdit',
        'conceptRequestServiceApp.objectService',
        'conceptRequestServiceApp.scroll'
		
    ])
    .config(function ($rootScopeProvider, $routeProvider, $modalProvider, $translateProvider, cfpLoadingBarProvider) {
        // up the digest limit to account for extremely long depth of SNOMEDCT trees leading to spurious errors
        // this is not an ideal solution, but this is a known edge-case until Angular 2.0 (see https://github.com/angular/angular.js/issues/6440)
        $rootScopeProvider.digestTtl(20);

        // set the default redirect/route
        $routeProvider
            .otherwise({
                redirectTo: '/dashboard'
            });

        // modal providers MUST not use animation
        // due to current angular-ui bug where the
        // animation prevents removal of grey backdrop on close
        $modalProvider.options.animation = false;

        // translate provider
        $translateProvider
            .registerAvailableLanguageKeys(['en'], {
                'en-*': 'en',
                'en_*': 'en'
            })
            .useStaticFilesLoader({
                files: [{
                    prefix: 'translations/locale-',
                    suffix: '.json'
                },
                {
                    prefix: 'translations/tooltips-',
                    suffix: '.json'
                }]

            })
            .uniformLanguageTag('bcp47')
            .determinePreferredLanguage()
            .fallbackLanguage('en');

        // loading bar
        cfpLoadingBarProvider.includeSpinner = false;
    })
    .run([
        '$rootScope',
        '$location',
        'configService',
        'accountService',
        'crsService',
        function ($rootScope, $location, configService, accountService, crsService) {
            var config = configService.getConfig();

            $rootScope.showAppLoading = false;
            $rootScope.showSplash = true;
            $rootScope.pageTitles = [];

            $rootScope.link = (config && config.link)?config.link: {};
            $rootScope.clientVersion = config.version;


            $rootScope.clientVersion = config.version;

            crsService.getServerVersion().then(function (serverVersion) {
                $rootScope.serverVersion = serverVersion;
            });

            if (!accountService.isCredentialChecked()) {
                $rootScope.showSplash = true;

                accountService.checkCredential().then(function () {
                    // inform other components that account info has been changed
                    $rootScope.$broadcast('crs:accountInfoChanged');

                    if (accountService.isUserLoggedIn()) {
                        $rootScope.showSplash = false;
                    } else {
                        $location.path('/login');
                    }
                });
            }
        }
    ]);