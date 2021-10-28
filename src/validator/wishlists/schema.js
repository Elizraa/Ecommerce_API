const Joi = require('joi');

const WishlistPayloadSchema = Joi.object({
  productId: Joi.string().required(),
});

module.exports = { WishlistPayloadSchema };
