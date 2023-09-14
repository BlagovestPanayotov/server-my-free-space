const { Types, model } = require('mongoose');

const LikeDestination = require("../models/LikeDestination");
const Comment = require('../models/Comment');

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

async function hasLikedPost(destId, userId) {
  return LikeDestination.findOne({ _ownerId: userId, _destinationId: destId });
}

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


async function getAllComments(_destinationId) {
  return Comment.find({ _destinationId });
}

module.exports = {
  getAllDestLikes,
  givePostLike,
  hasLikedPost,
  removePostLike,
  getAllComments
};