const { Schema, model, Types: { ObjectId } } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  country: { type: String, required: true },
  gender: { type: String, required: true },
  accountName: { type: String, required: true },
  image: {     
    imgUrl: { type: String, default: '' },
    thumbUrl: { type: String, default: '' }
  },
  accountNameChanged: { type: Boolean, required: true, default: false },
  verifyUrl: {
    url: { type: String, required: true },
    attempt: { type: Number, default: 0 },
    _createdAt: { type: Date, default: Date.now },
  },
  verified: { type: Boolean, require: true, default: false },
  messages: { type: [{ type: ObjectId, ref: 'Message' }], default: () => [], },
  followers: { type: [{ type: ObjectId, ref: 'User' }], default: () => [], },
  following: { type: [{ type: ObjectId, ref: 'User' }], default: () => [], },
  role: { type: [{ type: String }], default: () => ['user'], }
});

userSchema.index({ email: 1 }, {
  collation: {
    locale: 'en',
    strength: 2
  }
});

userSchema.index({ accountName: 1 }, {
  collation: {
    locale: 'en',
    strength: 2
  }
});

const User = model('User', userSchema);

module.exports = User;