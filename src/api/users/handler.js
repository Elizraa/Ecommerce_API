class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
    this.deleteUserByEmailHandler = this.deleteUserByEmailHandler.bind(this);
    this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this);
  }

  async postUserHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);
      const {
        name, email, phone_number: phoneNumber, password,
      } = request.payload;
      const userId = await this._service.addUser({
        name, email, phoneNumber, password,
      });

      const response = h.response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: {
          userId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      return error;
    }
  }

  async getUserByIdHandler(request) {
    try {
      const { id } = request.params;
      const user = await this._service.getUserById(id);
      return {
        status: 'success',
        data: {
          user,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async getUsersByUsernameHandler(request) {
    try {
      const { email = '' } = request.query;
      const users = await this._service.getUsersByName(email);
      return {
        status: 'success',
        data: {
          users,
        },
      };
    } catch (error) {
      return error;
    }
  }

  async deleteUserByEmailHandler(request) {
    try {
      const { email, password } = request.payload;
      await this._service.deleteUserByEmail(email, password);
      return {
        status: 'success',
        message: 'User berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = UsersHandler;
