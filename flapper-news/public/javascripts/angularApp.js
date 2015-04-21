var app = angular.module('flapperNews', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'MainController as mainCtrl',
            resolve: {
                postPromise: ['posts', function (posts) {
                    return posts.getAll();
                }]
            }
        })
        .state('posts', {
            url: '/posts/{id}',
            templateUrl: '/post.html',
            controller: 'PostsController as postsCtrl',
            resolve: {
                post: ['$stateParams', 'posts', function ($stateParams, posts) {
                    return posts.getPost($stateParams.id);
                }]
            }
        });

    $urlRouterProvider.otherwise('home');
}]);

app.factory('posts', ['$http', function ($http) {
    var service = {
        posts: []
    };

    service.getAll = function () {
        return $http.get('/posts')
            .success(function (data) {
                angular.copy(data, service.posts);
            });
    };

    service.getPost = function (id) {
        return $http.get('/posts/' + id)
            .then(function (res) {
                return res.data;
            });
    };

    service.addPost = function (post) {
        return $http.post('/posts', post)
            .success(function (data) {
                service.posts.push(data);
            });
    };

    service.incrementUpvote = function (post) {
        return $http.put('/posts/' + post._id + '/upvote')
            .success(function (data) {
                post.upvotes += 1;
            });
    };

    service.addComment = function (post, comment) {
        return $http.post('/posts/' + post._id + '/comments', comment)
            .success(function (data) {
                post.comments.push(data);
            });
    };

    service.incrementUpvoteComment = function (post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
            .success(function (data) {
                comment.upvotes += 1;
            })
            .error(function (err) {
                window.alert(err);
            });
    };

    return service;
}]);

app.factory('auth', ['$http', '$window', function ($http, $window) {
    var auth = {};

    auth.setToken = function (token) {
        $window.localStorage['flapper-news-token'] = token;
    };

    auth.getToken = function () {
        return $window.localStorage['flapper-news-token'];
    }

    auth.isLoggedIn = function () {
        var token = auth.getToken();

        if (!token) {
            return false;
        }

        var payload = JSON.parse($window.atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
    };

    auth.currentUser = function () {
        if (auth.isLoggedIn()) {
            var token = auth.getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.username;
        }
    };

    auth.register = function (user) {
        return $http.post('/register', user)
            .success(function (data) {
                auth.setToken(data.token);
            });
    };

    auth.logIn = function (user) {
        return $http.post('/login', user)
            .success(function (data) {
                auth.setToken(data.token);
            });
    };

    auth.logOut = function() {
        $window.localStorage.removeItem('flapper-news-token');
    };

    return auth;
}
])
;

app.controller('MainController', ['posts', function (posts) {
    this.currentPost = {}

    this.getPosts = function () {
        return posts.posts;
    };

    this.getPost = function (id) {
        return posts.getPost(id);
    };

    this.addPost = function () {
        if (!this.currentPost.title || this.currentPost.title == '') {
            return;
        }
        this.currentPost.upvotes = 0;
        posts.addPost(this.currentPost);
        this.currentPost = {};
    };

    this.incrementUpvote = function (post) {
        posts.incrementUpvote(post);
    };
}]);

app.controller('PostsController', ['posts', 'post', function (posts, post) {
    this.post = post;

    this.comment = {};
    this.addComment = function () {
        if (this.comment.body === '') {
            return;
        }
        if (!this.comment.upvotes) {
            this.comment.upvotes = 0;
        }
        if (!this.comment.author) {
            this.comment.author = 'Anonymous';
        }
        posts.addComment(post, this.comment);
        this.comment = {};
    };

    this.incrementUpvotes = function (comment) {
        posts.incrementUpvoteComment(this.post, comment);
    };
}]);
