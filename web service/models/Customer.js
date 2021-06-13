const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model(
  'Customers',
  new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    isGold: { type: Boolean, default: false },
  })
);

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    phone: Joi.string().length(10).required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(customer);
}

exports.Customer = Customer;
module.exports.validate = validateCustomer;
