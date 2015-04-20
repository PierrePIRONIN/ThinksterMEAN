var mongoose = require('mongoose');

var CommentSchema = mongoose.Schema({
    author: String,
    body: String,
    upvotes: {type: Number, default: 0},
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
});

CommentSchema.methods.upvoteToto = function(cb) {
    this.upvotes +=1;
    this.save(cb);
};

mongoose.model('Comment', CommentSchema);