const OrdersHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'orders',
  version: '1.0.0',
  register: async (server, { ordersService, validator }) => {
    const ordersHandler = new OrdersHandler(ordersService, validator);
    server.route(routes(ordersHandler));
  },
};
