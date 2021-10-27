const routes = (handler) => [
  {
    method: 'POST',
    path: '/products',
    handler: handler.postProductHandler,
    options: {
      auth: 'ecommerce_jwt',
    },
  },
  {
    method: 'GET',
    path: '/products',
    handler: handler.getProductsHandler,
  },
  {
    method: 'GET',
    path: '/products/onsell',
    handler: handler.getProductsOnSellHandler,
  },
  {
    method: 'GET',
    path: '/products/{category}',
    handler: handler.getProductsByCategoryHandler,
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
    options: {
      auth: 'ecommerce_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/products/{id}',
    handler: handler.deleteProductByIdHandler,
    options: {
      auth: 'ecommerce_jwt',
    },
  },
  {
    method: 'GET',
    path: '/products/seller/{id}',
    handler: handler.getProductsBySellerIdHandler,
  },
  {
    method: 'POST',
    path: '/product/image/{id}',
    handler: handler.postUploadImageHandler,
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
