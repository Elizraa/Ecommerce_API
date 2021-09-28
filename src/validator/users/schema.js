const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ tlds: true }).required(),
  phone_number: Joi.string().required(),
  seller: Joi.boolean().required(),
  password: Joi.string().required(),
});

module.exports = { UserPayloadSchema };
