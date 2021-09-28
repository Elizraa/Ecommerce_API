class ProductsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postProductHandler = this.postProductHandler.bind(this);
    this.getProductsHandler = this.getProductsHandler.bind(this);
    this.getProductByIdHandler = this.getProductByIdHandler.bind(this);
    this.getProductsBySellerIdHandler = this.getProductsBySellerIdHandler.bind(this);
    this.putProductByIdHandler = this.putProductByIdHandler.bind(this);
    this.deleteProductByIdHandler = this.deleteProductByIdHandler.bind(this);
  }

  async postProductHandler(request, h) {
    try {
      this._validator.validateProductPayload(request.payload);
      const {
        name, description, category, price, stock, sellerId,
      } = request.payload;

      const productId = await this._service.addProduct({
        name, description, category, price, stock, sellerId,
      });

      const response = h.response({
        status: 'success',
        message: 'Product berhasil ditambahkan',
        data: {
          productId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getProductsHandler() {
    const products = await this._service.getProducts();
    return {
      status: 'success',
      data: {
        products,
      },
    };
  }

  async getProductByIdHandler(request) {
    try {
      const { id } = request.params;
      const product = await this._service.getProductById(id);
      return {
        status: 'success',
        data: {
          product,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async putProductByIdHandler(request) {
    try {
      this._validator.validateProductPayload(request.payload);
      const { id } = request.params;

      await this._service.editProductById(id, request.payload);

      return {
        status: 'success',
        message: 'Product berhasil diperbarui',
      };
    } catch (error) {
      return error;
    }
  }

  async deleteProductByIdHandler(request) {
    try {
      const { id } = request.params;
      await this._service.deleteProductById(id);
      return {
        status: 'success',
        message: 'Product berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }

  async getProductsBySellerIdHandler(request) {
    try {
      const { sellerId } = request.params;
      const product = await this._service.getProductsBySellerId(sellerId);
      return {
        status: 'success',
        data: {
          product,
        },
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = ProductsHandler;
