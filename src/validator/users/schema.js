const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  email: Joi.string().email({ tlds: true }).required(),
  name: Joi.string().required(),
  phone_number: Joi.string().required(),
//  seller: Joi.boolean().required(),
  password: Joi.string().required(),
});

module.exports = { UserPayloadSchema };
