const {
  getAllDestLikes,
  hasLikedPost,
  givePostLike,
  removePostLike,

  getAllComments,
  createComment,
  updateComment,
  deleteCommentById,

  getCommentLikes,
  hasLikedComment,
  getCommentById,
  giveCommentLike,
} = require('../services/accessoryDestService');
const errorParser = require('../utils/errorParser');

const accessoryDestController = require('express').Router();

//LIKES

accessoryDestController.get('/likes', async (req, res) => {
  try {
    console.log('>>> GET /accessory/likes');

    const destId = req.query.dest;

    const likes = await getAllDestLikes(destId, req.user?._id);

    res.json(likes);
  } catch (err) {
    const error = errorParser(err);
    res.status(400).json({ error });
  }
});

accessoryDestController.post('/likes', async (req, res) => {
  console.log('>>> POST /accessory/likes');

  try {
    const destId = req.body._destinationId;
    const userId = req.user._id;


    const liked = await hasLikedPost(destId || null, userId);
    if (liked) {
      throw new Error('You have already liked this destination!');
    }

    await givePostLike(destId, userId);
    res.status(204).end();
  } catch (err) {
    const error = errorParser(err);
    res.status(401).json({ error });
  }
});

accessoryDestController.post('/likes/remove', async (req, res) => {
  console.log('>>> POST /accessory/likes/remove');

  try {
    const destId = req.body._destinationId;
    const userId = req.user._id;
    const liked = await hasLikedPost(destId, userId);

    if (!liked) {
      throw new Error('You have not liked this destination!');
    }

    await removePostLike(destId, userId);
    res.status(204).end();
  } catch (err) {
    const error = errorParser(err);
    res.status(401).json({ error });
  }
});


//COMMENTS

accessoryDestController.get('/comments', async (req, res) => {
  console.log(`>>> GET /accessory/comments ${req.query.dest}`);

  try {
    const destId = req.query.dest;

    const comments = await getAllComments(destId);

    res.json(comments);

  } catch (err) {
    const error = errorParser(err);
    res.status(400).json({ error });
  }

});

accessoryDestController.post('/comments', async (req, res) => {
  console.log(`>>> POST /accessory/comments ${req.query.dest}`);

  try {
    const { _destinationId, content } = req.body;
    const _ownerId = req.user._id;

    const comment = await createComment(_destinationId, content, _ownerId);

    res.status(201).json(comment);
  } catch (err) {
    const error = errorParser(err);
    res.status(403).json({ error });
  }
});

accessoryDestController.put('/comments/edit/:id', async (req, res) => {
  console.log(`>>> PUT /accessoty/comments/edit/${req.params.id}`);

  const comment = await getCommentById(req.params.id);

  if (req.user._id != comment._ownerId) {

    return res.status(403).json({ message: 'You cannot modify this comment!' });
  }

  try {
    const coment = await updateComment(req.params.id, req.body);
    res.json(coment);
  } catch (err) {
    const error = errorParser(err);
    res.status(400).json({ error });
  }
});

accessoryDestController.delete('/comments/delete/:id', async (req, res) => {
  console.log(`>>> DELETE /accessoty/comments/delete/${req.params.id}`);

  const comment = await getCommentById(req.params.id);

  if (req.user._id != comment._ownerId) {

    return res.status(403).json({ message: 'You cannot delete this comment!' });
  }

  try {
    await deleteCommentById(req.params.id);
    res.status(204).end();
  } catch (err) {
    const error = errorParser(err);
    res.status(400).json({ error });
  }
});

//COMMENT-LIKES

accessoryDestController.get('/comments/commentLikes', async (req, res) => {
  try {
    console.log(`>>> GET /accessory/comments/commentLikes`);

    const commentId = req.query.comment;

    const likes = await getCommentLikes(commentId, req.user?._id);

    res.json(likes);
  } catch (err) {
    const error = errorParser(err);
    res.status(400).json({ error });
  }

});

accessoryDestController.post('/comments/commentLikes', async (req, res) => {
  console.log('>>> POST /accessory/comments/commentLikes');

  try {
    const commentId = req.body._commentId;
    const userId = req.user._id;


    const liked = await hasLikedComment(commentId || null, userId);
    if (liked) {
      throw new Error('You have already liked this comment!');
    }

    await giveCommentLike(commentId, userId);
    res.status(204).end();
  } catch (err) {
    const error = errorParser(err);
    res.status(401).json({ error });
  }
});



// const hasLiked = await LikeComment.findOne({ _ownerId: userId }, { __destinationId: postId });




module.exports = accessoryDestController;