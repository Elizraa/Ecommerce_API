require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
// const path = require('path');

const ClientError = require('./exceptions/ClientError');

// products
const products = require('./api/products');
const ProductsService = require('./services/postgres/ProductsService');
const ProductsValidator = require('./validator/products');

// orders
const orders = require('./api/orders');
const OrdersService = require('./services/postgres/OrdersService');
const OrdersValidator = require('./validator/orders');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// wishlists
const wishlists = require('./api/wishlist');
const WishlistService = require('./services/postgres/WishlistsService');
const WishlistValidator = require('./validator/wishlists');

// uploads
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

// times
const times = require('./api/times');
const TimesService = require('./services/postgres/TimesService');
const TimesValidator = require('./validator/times');

const init = async () => {
  const productsService = new ProductsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const storageService = new StorageService();
  const ordersService = new OrdersService();
  const wishlistService = new WishlistService();
  const timesService = new TimesService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: true,
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('ecommerce_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: products,
      options: {
        service: productsService,
        imageService: storageService,
        validator: ProductsValidator,
        validatorImage: UploadsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        imageService: storageService,
        validator: UsersValidator,
        validatorImage: UploadsValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
    {
      plugin: orders,
      options: {
        service: ordersService,
        validator: OrdersValidator,
      },
    },
    {
      plugin: wishlists,
      options: {
        service: wishlistService,
        validator: WishlistValidator,
      },
    },
    {
      plugin: times,
      options: {
        service: timesService,
        validator: TimesValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;

    if (!(response instanceof Error)) {
      return response.continue || response;
    }

    if (response instanceof ClientError || response.output.statusCode === 401
      || response.output.statusCode === 413) {
      // membuat response baru dari response toolkit sesuai kebutuhan error handling
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      if (response.output.statusCode === 401 || response.output.statusCode === 413) {
        newResponse.code(response.output.statusCode);
      } else {
        newResponse.code(response.statusCode);
      }
      return newResponse;
    }
    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    const newResponse = h.response({
      status: 'error',
      message: 'Maaf, terjadi kegagalan pada server kami.',
    });
    console.log(response.output.statusCode);
    newResponse.code(500);
    console.error(response);
    return newResponse;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
