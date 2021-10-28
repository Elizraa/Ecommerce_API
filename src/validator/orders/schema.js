const Joi = require('joi');

const OrdersPayloadSchema = Joi.object({
  productId: Joi.string().required(),
  finalPrice: Joi.number().required(),
});

module.exports = { OrdersPayloadSchema };
