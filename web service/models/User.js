const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi-oid');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024, // since its getting HASHED
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
    },
    config.get('jwtPrivateKey')
  );
  return token;
};

const User = mongoose.model('Users', userSchema);

function validateRegister(object) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(object);
}

function validateLogin(object) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(object);
}

exports.User = User;
exports.validateLogin = validateLogin;
exports.validateRegister = validateRegister;
