var app = angular.module('flapperNews', []);

app.controller('MainController', function() {
   this.posts = [
      {title: 'post 1', upvotes: 5},
      {title: 'post 2', upvotes: 2},
      {title: 'post 3', upvotes: 15},
      {title: 'post 4', upvotes: 9},
      {title: 'post 5', upvotes: 4}
   ];

   this.currentPost = {}

   this.addPost = function() {
      if (!this.currentPost.title || this.currentPost.title == '') {
         return;
      }
      this.currentPost.upvotes = 0;
      this.posts.push(this.currentPost);
      this.currentPost = {}
   }

   this.incrementUpvote = function(post) {
      post.upvotes += 1;
   }
});