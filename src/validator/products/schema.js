const Joi = require('joi');

const ProductPayloadSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  category: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  on_sell: Joi.boolean().required(),
  user_id: Joi.string().required(),
});

module.exports = { ProductPayloadSchema };
