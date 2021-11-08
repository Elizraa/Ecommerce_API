const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUserByIdHandler,
    options: {
      auth: 'ecommerce_jwt',
    },
  },
  {
    method: 'POST',
    path: '/users/saldo',
    handler: handler.postSaldoHandler,
    options: {
      auth: 'ecommerce_jwt',
    },
  },
  {
    method: 'GET',
    path: '/users/{name}',
    handler: handler.getUsersByUsernameHandler,
  },
  {
    method: 'GET',
    path: '/users/topSaldo',
    handler: handler.getUsersSaldoHighestHandler,
  },
  // {
  //   method: 'GET',
  //   path: '/users/topBuyer',
  //   handler: handler.getTopBuyertHandler,
  // },
  {
    method: 'DELETE',
    path: '/users',
    handler: handler.deleteUserByEmailHandler,
  },
  {
    method: 'POST',
    path: '/users/upload/profile',
    handler: handler.postUploadProfileImageHandler,
    options: {
      payload: {
        maxBytes: 1048576,
        allow: ['application/json', 'image/jpeg', 'multipart/form-data'],
        multipart: true,
        output: 'stream',
      },
      auth: 'ecommerce_jwt',
    },
  },
  {
    method: 'POST',
    path: '/users/upload/cover',
    handler: handler.postUploadCoverImageHandler,
    options: {
      payload: {
        maxBytes: 1048576,
        allow: ['application/json', 'image/jpeg', 'multipart/form-data'],
        multipart: true,
        output: 'stream',
      },
      auth: 'ecommerce_jwt',
    },
  },
];

module.exports = routes;
