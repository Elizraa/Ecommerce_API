const InvariantError = require('../../exceptions/InvariantError');
const { TimesPayloadSchema } = require('./schema');

const TimesValidator = {
  validateTimesPayload: (payload) => {
    const validationResult = TimesPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = TimesValidator;


