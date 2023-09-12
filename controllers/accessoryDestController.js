const { getAllDestLikes, hasLiked, givePostLike } = require('../services/accessoryDestService');
const errorParser = require('../utils/errorParser');

const accessoryDestController = require('express').Router();


accessoryDestController.get('/likes', async (req, res) => {
  try {
    console.log('>>> /accessory/likes');

    const destId = req.query.dest;

    const likes = await getAllDestLikes(destId, req.user._id);

    res.json(likes);
  } catch (err) {
    const error = errorParser(err);
    res.status(400).json({ error });
  }
});

accessoryDestController.post('/likes', async (req, res) => {
  try {
    const destId = req.body._destinationId;
    const userId = req.user._id;

    const liked = await hasLiked(destId, userId);
    if (liked) {
      throw new Error('You have already liked this destination!');
    }

    await givePostLike(destId, userId);
    res.status(204).end();
  } catch (err) {
    const error = errorParser(err);
    res.status(400).json({ error });
  }
});

// const hasLiked = await LikeComment.findOne({ _ownerId: userId }, { __destinationId: postId });




module.exports = accessoryDestController;