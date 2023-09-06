const { Schema, model, Types: { ObjectId } } = require('mongoose');

const commentSchema = new Schema({
  _destinationId: { type: ObjectId, ref: 'Destination', required: true },
  _ownerId: { type: ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, minlength: [5, 'The comment must be at least 5 characters long!'] }
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;

//get comment population!!!
//OR
//get comments by querry - destId