class WishlistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postWishlistHandler = this.postWishlistHandler.bind(this);
    this.deleteWishlistHandler = this.deleteWishlistHandler.bind(this);
    // this.deleteUserByEmailHandler = this.deleteUserByEmailHandler.bind(this);
    // this.getUsersByUsernameHandler = this.getUsersByUsernameHandler.bind(this);
  }

  async postWishlistHandler(request, h) {
    try {
      this._validator.validateUserPayload(request.payload);
      const {
        user_id, product_id,
      } = request.payload;
      const userId = await this._service.addWishlist({
        user_id, product_id,
      });

      const response = h.response({
        status: 'success',
        message: 'Wishlist berhasil ditambahkan',
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

  async deleteWishlistHandler(request) {
    try {
      const { user_id, product_id } = request.payload;
      await this._service.deleteWishlist(user_id, product_id);
      return {
        status: 'success',
        message: 'Wishlist berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }

  async getWishlistByIdHandler(request) {
    try {
      const { id } = request.params;
      const product = await this._service.getWishlistById(id);
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

module.exports = WishlistHandler;

// class CollaborationsHandler {
//   constructor(collaborationsService, playlistsService, validator) {
//     this._collaborationsService = collaborationsService;
//     this._playlistsService = playlistsService;
//     this._validator = validator;

//     this.postWishlistHandler = this.postWishlistHandler.bind(this);
//     this.deleteWishlistHandler = this.deleteWishlistHandler.bind(this);
//   }

//   async postCollaborationHandler(request, h) {
//     try {
//       this._validator.validateCollaborationPayload(request.payload);
//       const { id: credentialId } = request.auth.credentials;
//       const { playlistId, userId } = request.payload;

//       await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
//       const collaborationId = await this._collaborationsService.addCollaboration(
//         playlistId, userId,
//       );

//       const response = h.response({
//         status: 'success',
//         message: 'Kolaborasi berhasil ditambahkan',
//         data: {
//           collaborationId,
//         },
//       });
//       response.code(201);
//       return response;
//     } catch (error) {
//       return error;
//     }
//   }

//   async deleteCollaborationHandler(request) {
//     try {
//       this._validator.validateCollaborationPayload(request.payload);
//       const { id: credentialId } = request.auth.credentials;
//       const { playlistId, userId } = request.payload;

//       await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
//       await this._collaborationsService.deleteCollaboration(playlistId, userId);

//       return {
//         status: 'success',
//         message: 'Kolaborasi berhasil dihapus',
//       };
//     } catch (error) {
//       return error;
//     }
//   }
// }

// module.exports = CollaborationsHandler;
