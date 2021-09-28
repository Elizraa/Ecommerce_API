const ProductsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'product',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const productsHandler = new ProductsHandler(service, validator);
    server.route(routes(productsHandler));
  },
};
