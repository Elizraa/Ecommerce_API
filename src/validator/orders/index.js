const { OrdersPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const OrderssValidator = {
  validateOrdersPayload: (payload) => {
    const validationResult = OrdersPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = OrderssValidator;
