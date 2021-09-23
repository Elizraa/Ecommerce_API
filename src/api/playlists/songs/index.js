const PlaylistsSongHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistSong',
  version: '1.0.0',
  register: async (server, { playlistsService, validator }) => {
    const playlistsSongHandler = new PlaylistsSongHandler(playlistsService, validator);
    server.route(routes(playlistsSongHandler));
  },
};
