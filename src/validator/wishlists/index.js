const InvariantError = require('../../exceptions/InvariantError');
const { WishlistPayloadSchema } = require('./schema');

const WishlistsValidator = {
  validateWishlistPayload: (payload) => {
    const validationResult = WishlistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = WishlistsValidator;
