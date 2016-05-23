'use strict';

angular
    .module('conceptRequestServiceApp.jiraComment')
    .controller('JiraCommentCtrl', [
        '$scope',
        'jiraCommentService',
        function ($scope, jiraCommentService) {
            var vm = this;

            var initView = function () {
                loadComments();
            };

            var loadComments = function () {
                vm.loadingComment = true;
                jiraCommentService.getComments($scope.request.id).then(function (response) {
                    vm.loadingComment = false;
                    vm.comments = response;
                });
            };

            var postComment = function (isInternal) {
                if (vm.message && vm.message.trim()) {
                    vm.postingComment = true;
                    jiraCommentService.postComments($scope.request.id, vm.message, isInternal).then(function () {
                        vm.message = null;
                        vm.postingComment = false;
                        loadComments();
                    });
                }
            };

            vm.postComment = postComment;
            vm.comments = null;
            vm.message = null;
            vm.loadingComment = true;
            vm.postingComment = false;
            initView();
        }
    ]);