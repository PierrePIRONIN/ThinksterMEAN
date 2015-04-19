var app = angular.module('flapperNews', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'MainController as mainCtrl'
        })
        .state('posts', {
            url: '/posts/{id}',
            templateUrl: '/post.html',
            controller: 'PostsController as postsCtrl'
        });

    $urlRouterProvider.otherwise('home');
}]);

app.factory('posts', function () {
    var service = {};

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

app.controller('PostsController', ['$stateParams', 'posts', function ($stateParams, posts) {
    this.post = posts.posts[$stateParams.id];

    this.comment = {};
    this.addComment = function() {
        if (this.comment.body === '') {
            return;
        }
        if (!this.comment.upvotes) {
            this.comment.upvotes = 0;
        }
        if (!this.comment.author) {
            this.comment.author = 'Anonymous';
        }
        this.post.comments.push(this.comment);
        this.comment = {};
    }

    this.incrementUpvotes = function(comment) {
        comment.upvotes += 1;
    };
}]);
