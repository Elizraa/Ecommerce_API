class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    this.getImageHandler = this.getImageHandler.bind(this);
  }

  async postUploadImageHandler(request, h) {
    try {
      const { data } = request.payload;
      const { id } = request.params;
      this._validator.validateImageHeaders(data.hapi.headers);
      const fileLocation = await this._service.writeFile(data, data.hapi);
      console.log(fileLocation);
      const imageId = await this._service.insertTable(id, fileLocation);
      const response = h.response({
        status: 'success',
        message: 'Gambar berhasil diunggah',
        data: {
          imageId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getImageHandler(request, h) {
    try {
      const { id } = request.params;
      const urlImage = await this._service.getImage(id);
      const response = h.response({
        status: 'success',
        message: 'URL Gambar',
        data: {
          urlImage,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      return error;
    }
  }
}

module.exports = UploadsHandler;
