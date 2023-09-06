const { Schema, model, Types: { ObjectId } } = require('mongoose');

const likeCommentSchema = new Schema({
  _commentId: { type: ObjectId, ref: 'Comment', required: true },
  _ownerId: { type: ObjectId, ref: 'User', required: true },
});

const LikeComment = model('Like', likeCommentSchema);

module.exports = LikeComment;
