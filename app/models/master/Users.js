const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const jwtPrivatKey = process.env.JWT_PRIVATE_KEY


const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },

  name: {
    type: String,
    maxlength: 50,
    minlength: 3,
    required: true
  },
  username: {
    type: String,
    maxlength: 50,
    minlength: 3,
    required: true
  },

  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  }

}, {
  timestamps: true
});



userSchema.methods.generateAuthToken = function () {
  let obj = { _id: this._id, isAdmin: this.isAdmin }
  return jwt.sign(obj, jwtPrivatKey)
}


module.exports = Users = mongoose.model("Users", userSchema);
