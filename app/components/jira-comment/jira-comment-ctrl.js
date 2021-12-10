'use strict';

angular
    .module('conceptRequestServiceApp.jiraComment')
    .controller('JiraCommentCtrl', [
        '$scope',
        'jiraCommentService',
        '$timeout',
        function ($scope, jiraCommentService, $timeout) {
            var vm = this;
            var isInternal = false;

            var initView = function () {
                loadComments();
            };

            var loadComments = function () {
                if ($scope.request) {
                    vm.loadingComment = true;
                    jiraCommentService.getComments($scope.request.id).then(function (response) {
                        vm.loadingComment = false;
                        vm.comments = response;
                    });
                }
            };

            $scope.$on('ngRepeatFinished', function () {
                $timeout(function () {
                    $('.comment-body').each(function(){
                        // Get the content
                        var str = $(this).html();
                        // Set the regex string
                        var regex = /(https?:\/\/[^\s]+)/ig;
                        // Replace plain text links by hyperlinks
                        var replaced_text = str.replace(regex, "<a href='$1' target='_blank'>$1</a>");
                        // Echo link
                        $(this).html(replaced_text);
                    });
                }, 500);
            });

            var postComment = function () {
                if(vm.internalComment){
                    isInternal = true;
                }else{
                    isInternal = false;
                }
                if (vm.message && vm.message.trim() && $scope.request) {
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