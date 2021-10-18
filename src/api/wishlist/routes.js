const routes = (handler) => [
  {
    method: 'POST',
    path: '/wishlists',
    handler: handler.postWishlistHandler,
    options: {
      auth: 'ecommerce_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/wishlists/{id}',
    handler: handler.deleteWishlistHandler,
    options: {
      auth: 'ecommerce_jwt',
    },
  },
  {
    method: 'GET',
    path: '/wishlists',
    handler: handler.getWishlistHandler,
    options: {
      auth: 'ecommerce_jwt',
    },
  },
];

module.exports = routes;
