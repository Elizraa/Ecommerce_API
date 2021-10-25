class TimesHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;
  
      this.postTimesHandler = this.postTimesHandler.bind(this);
      this.postTimesWithUserHandler = this.postTimesWithUserHandler.bind(this);
      this.getTimesHandler = this.getTimesHandler.bind(this);
      this.getTimesHistoryHandler = this.getTimesHistoryHandler.bind(this);
      this.getTimesRecHandler = this.getTimesRecHandler.bind(this);
      // this.deleteUserByEmailHandler = this.deleteUserByEmailHandler.bind(this);
      // this.getWishlistByIdHandler = this.getWishlistByIdHandler.bind(this);
    }
  
    async postTimesHandler(request, h) {
      try {
        this._validator.validateTimesPayload(request.payload);
        const {
          productId,event
        } = request.payload;
        const wishlistId = await this._service.addTimes({
          productId, event,
        });
  
        const response = h.response({
          status: 'success',
          message: 'Wishlist berhasil ditambahkan',
          data: {
            wishlistId,
          },
        });
        response.code(201);
        return response;
      } catch (error) {
        return error;
      }
    }

    async postTimesWithUserHandler(request, h) {
        try {
          this._validator.validateTimesPayload(request.payload);
          const { id: credentialId } = request.auth.credentials;
          const {
            productId,event
          } = request.payload;
          const wishlistId = await this._service.addTimesWithUserId({
            productId, credentialId,event
          });
    
          const response = h.response({
            status: 'success',
            message: 'Wishlist berhasil ditambahkan',
            data: {
              wishlistId,
            },
          });
          response.code(201);
          return response;
        } catch (error) {
          return error;
        }
      }
  
   
  
    async getTimesHandler() {
        const times = await this._service.getTimes();
        return {
          status: 'success',
          data: {
            times,
          },
        };   
    }

    async getTimesHistoryHandler(request, h) {
      const { id: credentialId } = request.auth.credentials;
      const times = await this._service.getTimesHistory(credentialId);     
      return {
        status: 'success',
        data: {
          times,
        },
      };   
  }
  async getTimesRecHandler() {
    const times = await this._service.getTimesRec();
    return {
      status: 'success',
      data: {
        times,
      },
    };   
}
  }
  
  module.exports = TimesHandler;