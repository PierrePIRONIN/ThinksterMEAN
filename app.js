var app = angular.module('flapperNews', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'MainController as mainCtrl'
        });

    $urlRouterProvider.otherwise('home');
}]);

app.factory('posts', function () {
    var service = {};

    service.posts = [
        {title: 'post 1', upvotes: 5},
        {title: 'post 2', upvotes: 2},
        {title: 'post 3', upvotes: 15},
        {title: 'post 4', upvotes: 9},
        {title: 'post 5', upvotes: 4}
    ];

    return service;
});

app.controller('MainController', ['posts', function (posts) {

    this.currentPost = {}

    this.getPosts = function () {
        return posts.posts;
    };

    this.addPost = function () {
        if (!this.currentPost.title || this.currentPost.title == '') {
            return;
        }

        this.currentPost.upvotes = 0;
        posts.posts.push(this.currentPost);

        this.currentPost = {}
    }

    this.incrementUpvote = function (post) {
        post.upvotes += 1;
    }
}]);