const { Types, model } = require('mongoose');

const LikeDestination = require("../models/LikeDestination");
const Comment = require('../models/Comment');
const LikeComment = require('../models/LikeComment');

//DEST LIKES

async function hasLikedPost(destId, userId) {
  return LikeDestination.findOne({ _ownerId: userId, _destinationId: destId });
}

async function getAllDestLikes(destId, userId) {
  const likes = await LikeDestination.find({ _destinationId: destId }).count();
  if (userId) {
    const liked = await hasLikedPost(destId, userId);
    return [
      likes,
      !!liked
    ];
  }
  return [likes];
};

async function givePostLike(_destinationId, _ownerId) {
  return LikeDestination.create({
    _destinationId,
    _ownerId
  });

}

async function removePostLike(_destinationId, _ownerId) {
  return LikeDestination.findOneAndDelete({
    _destinationId,
    _ownerId
  });
}

//COMMENTS

async function getAllComments(_destinationId) {
  return Comment.find({ _destinationId });
}

async function getCommentById(_commentId) {
  return Comment.findById(_commentId);
}

async function createComment(_destinationId, content, _ownerId) {
  return Comment.create({
    _destinationId,
    content,
    _ownerId
  });
}

async function updateComment(_commentId, comment) {
  const existing = await Comment.findById(_commentId);
  existing.content = comment.content;

  return existing.save();
}


async function deleteCommentById(_id) {
  return Comment.findByIdAndDelete({ _id });
}


//COMMENTS LIKES

async function hasLikedComment(_destinationId, _ownerId) {
  return await LikeComment.findOne({ _destinationId, _ownerId });
}

async function getCommentLikes(_commentId, userId) {
  const likes = await LikeComment.find({ _commentId }).count();
  if (userId) {
    const liked = await hasLikedComment(_commentId, userId);
    return [
      likes,
      !!liked
    ];
  }
  return [likes];
}

async function giveCommentLike(_commentId, _ownerId) {
  return LikeComment.create({
    _commentId,
    _ownerId
  });
};



module.exports = {
  getAllDestLikes,

  givePostLike,
  hasLikedPost,
  removePostLike,

  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteCommentById,

  getCommentLikes,
  hasLikedComment,
  giveCommentLike,
};