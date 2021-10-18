class OrdersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postOrderHandler = this.postOrderHandler.bind(this);
    this.getOrdersHandler = this.getOrdersHandler.bind(this);
    this.deleteOrderByIdHandler = this.deleteOrderByIdHandler.bind(this);
  }

  async postOrderHandler(request, h) {
    try {
      this._validator.validateOrderPayload(request.payload);

      const { productId } = request.payload;
      const { id: owner } = request.auth.credentials;

      const orderId = await this._service.addOrder({ productId, owner });

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

  async getOrdersHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const orders = await this._service.getOrders(credentialId);
    return {
      status: 'success',
      data: {
        orders,
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
