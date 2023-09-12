const { Types, model } = require('mongoose');

const LikeDestination = require("../models/LikeDestination");

async function getAllDestLikes(destId, userId) {
  const likes = await LikeDestination.find({ _destinationId: destId }).count();
  const liked = await hasLiked(destId, userId);
  return [
    likes,
    !!liked
  ];
};

async function hasLiked(destId, userId) {
  return LikeDestination.findOne({ _ownerId: userId, _destinationId: destId });
}

async function givePostLike(_destinationId, _ownerId) {
  console.log(_destinationId);
  console.log(_ownerId);
  return LikeDestination.create({
    _destinationId,
    _ownerId
  });

}

module.exports = {
  getAllDestLikes,
  givePostLike,
  hasLiked
};