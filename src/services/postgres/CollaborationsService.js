const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class CollaborationsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addWishlist(userId, productId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO wishlist VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, productId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Wishlist gagal ditambahkan');
    }
    await this._cacheService.delete(`owner-${userId}`);
    return result.rows[0].id;
  }

  async deleteWishlist(userId, productId) {
    const query = {
      text: 'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2 RETURNING id',
      values: [userId, productId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
    await this._cacheService.delete(`owner-${userId}`);
  }

  async getWishlistByUserId(UserId) {
    const query = {
      text: 'select * from wishlist w inner join products p on p.id = w.product_id where w.user_id = $1',
      values: [UserId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Product tidak ditemukan');
    }

    return result.rows;

    // return result.rows.map(mapDBToModel)[0];
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;
