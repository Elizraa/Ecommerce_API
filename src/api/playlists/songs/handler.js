class PlaylistsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAddSongToPlaylistByIdHandler = this.postAddSongToPlaylistByIdHandler.bind(this);
    this.getSongInPlaylistByIdHandler = this.getSongInPlaylistByIdHandler.bind(this);
    this.deleteSongInPlaylistByIdHandler = this.deleteSongInPlaylistByIdHandler.bind(this);
  }

  async postAddSongToPlaylistByIdHandler(request, h) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { playlistId } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.verifySongId(songId);
      await this._service.postAddSongToPlaylistById(playlistId, songId);

      const response = h.response({
        status: 'success',
        message: 'Lagu berhasil ditambahkan ke playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getSongInPlaylistByIdHandler(request) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      const songs = await this._service.getSongInPlaylistById(playlistId);
      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deleteSongInPlaylistByIdHandler(request) {
    try {
      this._validator.validatePlaylistSongPayload(request.payload);
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      const { songId } = request.payload;
      await this._service.verifyPlaylistAccess(playlistId, credentialId);
      await this._service.verifySongId(songId);
      await this._service.deleteSongInPlaylistById(playlistId, songId);
      return {
        status: 'success',
        message: 'Lagu berhasil dihapus dari playlist',
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = PlaylistsHandler;
