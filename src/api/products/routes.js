const routes = (handler) => [
  {
    method: 'POST',
    path: '/products',
    handler: handler.postProductHandler,
  },
  {
    method: 'GET',
    path: '/products',
    handler: handler.getProductsHandler,
  },
  {
    method: 'GET',
    path: '/products/{id}',
    handler: handler.getProductByIdHandler,
  },
  {
    method: 'PUT',
    path: '/products/{id}',
    handler: handler.putProductByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/products/{id}',
    handler: handler.deleteProductByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/products/seller/{id}',
    handler: handler.getProductsBySellerIdHandler,
  },
  {
    method: 'POST',
    path: '/product/image/{id}',
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
];

module.exports = routes;
