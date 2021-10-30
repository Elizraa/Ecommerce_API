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
    path: '/orders/history/buy',
    handler: handler.getOrdersBuyerHandler,
    options: {
      auth: 'ecommerce_jwt',
    },
  },
  {
    method: 'GET',
    path: '/orders/history/sell',
    handler: handler.getOrdersSellerHandler,
    options: {
      auth: 'ecommerce_jwt',
    },
  },
  {
    method: 'GET',
    path: '/orders/history',
    handler: handler.getOrdersHistoryHandler,
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
  {
    method: 'GET',
    path: '/orders/tax/{sellerNationality}',
    handler: handler.getTaxNationalityHandler,
    options: {
      auth: 'ecommerce_jwt',
    },
  },
];

module.exports = routes;
