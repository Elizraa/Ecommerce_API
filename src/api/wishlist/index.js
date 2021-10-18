const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'wishlist',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const wishlistHandler = new CollaborationsHandler(
      service, validator,
    );
    server.route(routes(wishlistHandler));
  },
};
