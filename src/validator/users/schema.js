const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  email: Joi.string().email({ tlds: true }).required(),
  name: Joi.string().required(),
  phone_number: Joi.string().required(),
  nationality: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { UserPayloadSchema };
