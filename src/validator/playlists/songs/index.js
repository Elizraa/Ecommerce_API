const { PlaylistSongPayloadSchema } = require('./schema');
const InvariantError = require('../../../exceptions/InvariantError');

const PlaylistsSongValidator = {
  validatePlaylistSongPayload: (payload) => {
    const validationResult = PlaylistSongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistsSongValidator;
