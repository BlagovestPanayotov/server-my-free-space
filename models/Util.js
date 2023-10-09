const { Schema, model } = require("mongoose");

const utilSchema = new Schema({
  guestNumber: { type: Number, required: true },
});


const Util = model('Util', utilSchema);

module.exports = Util;