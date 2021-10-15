const routes = (handler) => [
  {
    method: 'POST',
    path: '/orders',
    handler: handler.postOrderHandler,
    options: {
      auth: 'ecommerce_jwt',
    },
  },
  {
    method: 'GET',
    path: '/orders',
    handler: handler.getOrdersHandler,
    options: {
      auth: 'ecommerce_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/orders/{orderId}',
    handler: handler.deleteOrderByIdHandler,
    options: {
      auth: 'ecommerce_jwt',
    },
  },
];

module.exports = routes;
