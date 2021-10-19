const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.postUserHandler,
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getUserByIdHandler,
  },
  {
    method: 'GET',
    path: '/users',
    handler: handler.getUsersByUsernameHandler,
  },
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
