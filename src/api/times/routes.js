const routes = (handler) => [
    {
      method: 'POST',
      path: '/times',
      handler: handler.postTimesHandler,
    },
    {
      method: 'POST',
      path: '/times/user',
      handler: handler.postTimesWithUserHandler,
      options: {
        auth: 'ecommerce_jwt',
      },
    },
    // {
    //   method: 'GET',
    //   path: '/wishlists',
    //   handler: handler.getWishlistHandler,
    //   options: {
    //     auth: 'ecommerce_jwt',
    //   },
    // },
  ];
  
  module.exports = routes;
  