class WishlistHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postWishlistHandler = this.postWishlistHandler.bind(this);
    this.deleteWishlistHandler = this.deleteWishlistHandler.bind(this);
    this.getWishlistHandler = this.getWishlistHandler.bind(this);
    // this.deleteUserByEmailHandler = this.deleteUserByEmailHandler.bind(this);
  //   this.getWishlistByIdHandler = this.getWishlistByIdHandler.bind(this);
  }

  async postWishlistHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const {
        productId,
      } = request.payload;
      const wishlistId = await this._service.addWishlist({
        productId, credentialId,
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

  async deleteWishlistHandler(request) {
    try {
      const { id } = request.params;
      await this._service.deleteWishlist(id);
      return {
        status: 'success',
        message: 'Wishlist berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }

  async getWishlistHandler() {
      const wishlist = await this._service.getWishlist();
      return {
        status: 'success',
        data: {
          wishlist,
        },
      };
     
    
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
