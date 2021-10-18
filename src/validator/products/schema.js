const Joi = require('joi');

const ProductPayloadSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  category: Joi.string().required(),
  price: Joi.number().required(),
  onSell: Joi.boolean().required(),
});

module.exports = { ProductPayloadSchema };
