const Joi = require('joi');

const CollaborationPayloadSchema = Joi.object({
  productId: Joi.string().required(),
});

module.exports = { CollaborationPayloadSchema };
