const { Schema, model, Types: { ObjectId } } = require("mongoose");

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  country: { type: String, required: true },
  gender: { type: String, required: true },
  accountName: { type: String, required: true },
  // image: {     //Check if type: String accepts undefined
  //   imgUrl: { type: String, default: undefined },
  //   thumbUrl: { type: String, default: undefined }
  // },
  accountNameChanged: { type: Boolean, required: true, default: false },
  verifyUrl: { type: String, required: true },
  verified: { type: Boolean, require: true, default: false },
  messages: { type: [{ type: ObjectId, ref: 'Message' }], default: () => [] },
  followers: { type: [{ type: ObjectId, ref: 'User' }], default: () => [] },
  following: { type: [{ type: ObjectId, ref: 'User' }], default: () => [] },
  role: { type: [{ type: String }], default: () => ['user'] }
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