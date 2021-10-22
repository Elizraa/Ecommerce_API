class OrdersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postOrderHandler = this.postOrderHandler.bind(this);
    this.getOrdersBuyerHandler = this.getOrdersBuyerHandler.bind(this);
    this.getOrdersSellerHandler = this.getOrdersSellerHandler.bind(this);
    this.deleteOrderByIdHandler = this.deleteOrderByIdHandler.bind(this);
    this.getOrdersHistoryHandler = this.getOrdersHistoryHandler.bind(this);
  }

  async postOrderHandler(request, h) {
    try {
      this._validator.validateOrderPayload(request.payload);

      const { productId } = request.payload;
      const { id: userId } = request.auth.credentials;

      const orderId = await this._service.addOrder(userId, productId);

      const response = h.response({
        status: 'success',
        message: 'Order berhasil ditambahkan',
        data: {
          orderId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getOrdersBuyerHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const orders = await this._service.getOrdersBuyer(credentialId);
    return {
      status: 'success',
      data: {
        orders,
      },
    };
  }

  async getOrdersSellerHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const orders = await this._service.getOrdersSeller(credentialId);
    return {
      status: 'success',
      data: {
        orders,
      },
    };
  }

  async getOrdersHistoryHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const ordersSell = await this._service.getOrdersSeller(credentialId);
    const ordersBuy = await this._service.getOrdersBuyer(credentialId);
    return {
      status: 'success',
      data: {
        ordersSell,
        ordersBuy,
      },
    };
  }

  async deleteOrderByIdHandler(request) {
    try {
      const { orderId } = request.params;
      const { id: credentialId } = request.auth.credentials;
      await this._service.verifyOrderOwner(orderId, credentialId);
      await this._service.deleteOrderById(orderId);
      return {
        status: 'success',
        message: 'Order berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = OrdersHandler;
