const { Schema, model, Types: { ObjectId, GeoJSON } } = require('mongoose');
const { countriesList, URL_REGEXP } = require('../utils/assets');

const Comment = require('./Comment');
const LikeDestination = require('./LikeDestination');

const destinationSchema = new Schema({
  name: { type: String, required: true, minlength: [5, 'Name must be at least 5 characters long!'], maxlength: [30, 'Name must be maximum 30 characters long!'] },
  country: { type: String, required: true, enum: { values: countriesList, message: 'The country is not valid!' } },
  description: { type: String, required: true, minlength: [20, 'Description must be at least 20 characters long!'], maxlength: [400, 'Description must be maximum 400 characters long!'] },
  img: {
    imgUrl: {
      type: String, required: true, validate: {
        validator: value => URL_REGEXP.test(value),
        message: 'Invalid imgUrl!'
      }
    },
    thumbUrl:{
      type: String, required: true, validate: {
        validator: value => URL_REGEXP.test(value),
        message: 'Invalid thumbURL!'
      }
    }
  },
  _ownerId: { type: ObjectId, ref: 'User', required: true },
  comments: { type: [{ type: ObjectId, ref: 'Comment' }], default: () => [] },
  likes: { type: [{ type: ObjectId, ref: 'LikeDestination' }], default: () => [] },
  // location: {  //Has to gonfig it https://www.mongodb.com/docs/manual/geospatial-queries/
  //   type: GeoJSON,
  //   coordinates: [longitude, latitude]
  // },
  _createdAt: { type: Date, default: Date.now }
});

const Destination = model('Destination', destinationSchema);

module.exports = Destination;