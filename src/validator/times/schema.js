const Joi = require('joi');

const TimesPayloadSchema = Joi.object({
  
  productId: Joi.string().required(),
  event: Joi.string().required()
});

module.exports = { TimesPayloadSchema };
