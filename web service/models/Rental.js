const Joi = require('joi-oid');
const mongoose = require('mongoose');

const Rental = mongoose.model(
  'rentals',
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: { type: String, required: true },
        phone: { type: String, required: true },
        isGold: { type: Boolean, default: false },
      }),
      required: true,
    },

    movie: {
      type: new mongoose.Schema({
        title: { type: String, trim: true, required: true },
        dailyRentalRate: { type: Number },
      }),
      required: true,
    },

    dateOut: {
      type: Date,
      required: true,
      default: Date.now(),
    },

    dateReturned: {
      type: Date,
    },

    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function validateRental(object) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(object);
}

exports.Rental = Rental;
exports.validate = validateRental;
