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
    {
      method: 'GET',
      path: '/times',
      handler: handler.getTimesHandler,
    },
    {
      method: 'GET',
      path: '/times/history',
      handler: handler.getTimesHistoryHandler,
      options: {
        auth: 'ecommerce_jwt',
      },
    },
    {
      method: 'GET',
      path: '/times/rec',
      handler: handler.getTimesRecHandler,
    }
  ];
  
  module.exports = routes;
  