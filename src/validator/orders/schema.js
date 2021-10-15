const Joi = require('joi');

const OrdersPayloadSchema = Joi.object({
  productId: Joi.string().required(),
});

module.exports = { OrdersPayloadSchema };
