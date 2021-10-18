const ProductsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'product',
  version: '1.0.0',
  register: async (server, {
    service, imageService, validator, validatorImage,
  }) => {
    const productsHandler = new ProductsHandler(service, imageService, validator, validatorImage);
    server.route(routes(productsHandler));
  },
};
