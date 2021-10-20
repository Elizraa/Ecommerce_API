class ProductsHandler {
  constructor(service, serviceImage, validator, validatorImage) {
    this._service = service;
    this._serviceImage = serviceImage;
    this._validatorImage = validatorImage;
    this._validator = validator;

    this.postProductHandler = this.postProductHandler.bind(this);
    this.getProductsHandler = this.getProductsHandler.bind(this);
    this.getProductsOnSellHandler = this.getProductsOnSellHandler.bind(this);
    this.getProductByIdHandler = this.getProductByIdHandler.bind(this);
    this.getProductsBySellerIdHandler = this.getProductsBySellerIdHandler.bind(this);
    this.putProductByIdHandler = this.putProductByIdHandler.bind(this);
    this.deleteProductByIdHandler = this.deleteProductByIdHandler.bind(this);
    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
  }

  async postProductHandler(request, h) {
    try {
      this._validator.validateProductPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const {
        name, description, category, price, onSell,
      } = request.payload;

      const productId = await this._service.addProduct({
        name, description, category, price, onSell, credentialId,
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

  async getProductsOnSellHandler() {
    const products = await this._service.getProductsOnSell();
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

  async postUploadImageHandler(request, h) {
    try {
      const { data } = request.payload;
      const { id } = request.params;
      this._validatorImage.validateImageHeaders(data.hapi.headers);
      const fileLocation = await this._serviceImage.writeFile(data, data.hapi);
      // console.log(fileLocation);
      await this._service.insertImage(id, fileLocation);
      const response = h.response({
        status: 'success',
        message: 'Gambar berhasil diunggah',
        data: {
          fileLocation,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = ProductsHandler;
