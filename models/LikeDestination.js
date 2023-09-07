const { Schema, model, Types: { ObjectId } } = require('mongoose');

const likeDestinationSchema = new Schema({
  _destinationId: { type: ObjectId, ref: 'Destination', required: true },
  _ownerId: { type: ObjectId, ref: 'User', required: true },
});

const LikeDestination = model('LikeDestination', likeDestinationSchema);

module.exports = LikeDestination;
