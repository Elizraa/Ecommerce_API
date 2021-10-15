const path = require('path');

const routes = (handler) => [
  {
    method: 'POST',
    path: '/upload/pictures/{id}',
    handler: handler.postUploadImageHandler,
    options: {
      payload: {
        maxBytes: 524288,
        allow: ['application/json', 'image/jpeg', 'multipart/form-data'],
        multipart: true,
        output: 'stream',
      },
    },
  },
  {
    method: 'GET',
    path: '/pictures/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'file/images'),
      },
    },
  },
];

module.exports = routes;
