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

    service.posts = [
        {
            title: 'post 1',
            upvotes: 5,
            comments: [
                {author: 'me', body: 'Fake 1', upvotes: 0},
                {author: 'you', body: 'Fake 2', upvotes: 0},
                {author: 'him', body: 'Fake 3', upvotes: 0},
            ]
        },
        {
            title: 'post 2',
            upvotes: 2,
            comments: [
                {author: 'me', body: 'Fake 11', upvotes: 0},
                {author: 'you', body: 'Fake 22', upvotes: 0},
                {author: 'him', body: 'Fake 33', upvotes: 0},
            ]
        },
        {
            title: 'post 3',
            upvotes: 15,
            comments: [
                {author: 'me', body: 'Fake 111', upvotes: 0},
                {author: 'you', body: 'Fake 222', upvotes: 0},
                {author: 'him', body: 'Fake 333', upvotes: 0},
            ]
        },
        {
            title: 'post 4',
            upvotes: 9,
            comments: [
                {author: 'me', body: 'Fake 1111', upvotes: 0},
                {author: 'you', body: 'Fake 2222', upvotes: 0},
                {author: 'him', body: 'Fake 3333', upvotes: 0},
            ]
        },
        {
            title: 'post 5',
            upvotes: 4,
            comments: [
                {author: 'me', body: 'Fake 11111', upvotes: 0},
                {author: 'you', body: 'Fake 22222', upvotes: 0},
                {author: 'him', body: 'Fake 33333', upvotes: 0},
            ]
        }
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
