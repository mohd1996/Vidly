const Joi = require('joi-oid');
const mongoose = require('mongoose');
const { genreSchema } = require('./Genre');

const Movie = mongoose.model(
  'Movie',
  new mongoose.Schema({
    title: { type: String, trim: true, unique: true, required: true },
    genre: { type: genreSchema, required: true },
    numberInStock: { type: Number, default: 0 },
    dailyRentalRate: { type: Number, default: 0 },
  })
);

function validateMovie(object) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
  });
  return schema.validate(object);
}

exports.Movie = Movie;
exports.validate = validateMovie;
