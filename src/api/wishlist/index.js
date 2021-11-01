const WishlistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'wishlist',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const wishlistHandler = new WishlistsHandler(
      service, validator,
    );
    server.route(routes(wishlistHandler));
  },
};
