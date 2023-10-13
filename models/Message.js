const { Schema, model, Types: { ObjectId } } = require("mongoose");


const messageSchema = new Schema({
  _ownerId: { type: ObjectId, ref: 'User', require: true },
  _recipientId: { type: ObjectId, ref: 'User', require: true },
  _createdAt: { type: Date, default: Date.now }
});