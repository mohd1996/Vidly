const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const Genre = mongoose.model('Genre', genreSchema);

function validateGenre(object) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });
  return schema.validate(object);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;
