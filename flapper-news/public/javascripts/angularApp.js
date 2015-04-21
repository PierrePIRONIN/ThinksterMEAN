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
        })
        .state('login', {
            url: '/login',
            templateUrl: '/login.html',
            controller: 'AuthController as authCtrl',
            onEnter: ['$state', 'auth', function ($state, auth) {
                if (auth.isLoggedIn()) {
                    $state.go('home');
                }
            }]
        })
        .state('register', {
            url: '/register',
            templateUrl: '/register.html',
            controller: 'AuthController as authCtrl',
            onEnter: ['$state', 'auth', function ($state, auth) {
                if (auth.isLoggedIn()) {
                    $state.go('home');
                }
            }]
        });

    $urlRouterProvider.otherwise('home');
}]);

app.factory('posts', ['$http', 'auth', function ($http, auth) {
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
        return $http.post('/posts', post, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            service.posts.push(data);
        });
    };

    service.incrementUpvote = function (post) {
        return $http.put('/posts/' + post._id + '/upvote', null, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            post.upvotes += 1;
        });
    };

    service.addComment = function (post, comment) {
        return $http.post('/posts/' + post._id + '/comments', comment, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
            post.comments.push(data);
        });
    };

    service.incrementUpvoteComment = function (post, comment) {
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).success(function (data) {
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

    auth.logOut = function () {
        $window.localStorage.removeItem('flapper-news-token');
    };

    return auth;
}]);

app.controller('MainController', ['posts', 'auth', function (posts, auth) {
    this.currentPost = {}

    this.isLoggedIn = auth.isLoggedIn;

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

app.controller('PostsController', ['posts', 'post', 'auth', function (posts, post, auth) {
    this.post = post;
    this.comment = {};

    this.isLoggedIn = auth.isLoggedIn;

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

app.controller('AuthController', ['$state', 'auth', function ($state, auth) {
    this.user = {};

    this.register = function () {
        auth.register(this.user)
            .error(function (error) {
                this.error = error;
            }).then(function () {
                $state.go('home');
            });
    };

    this.logIn = function () {
        auth.logIn(this.user)
            .error(function (error) {
                this.error = error;
            }).then(function () {
                $state.go('home');
            });
    };
}]);

app.controller('NavController', ['auth', function (auth) {
    this.isLoggedIn = auth.isLoggedIn;
    this.currentUser = auth.currentUser;
    this.logOut = auth.logOut;
}]);