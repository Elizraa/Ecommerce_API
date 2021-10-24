const TimesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'times',
  version: '1.0.0',
  register: async (server, { service, validator }) => {
    const timesHandler = new TimesHandler(
      service, validator,
    );
    server.route(routes(timesHandler));
  },
};
