const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel } = require('../../utils');

class CollaborationsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addWishlist({
    productId, credentialId,
  }) {
    const id = `wishlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO wishlist VALUES($1, $2, $3) RETURNING id',
      values: [id, productId, credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Wishlist gagal ditambahkan');
    }
    // await this._cacheService.delete(`owner-${userId}`);
    return result.rows[0].id;
  }

  async deleteWishlist(id) {
    const query = {
      text: 'DELETE FROM wishlist WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new InvariantError('Wishlist gagal dihapus');
    }
  }

  async getWishlist() {
    const result = await this._pool.query('select w.id, w.product_id, p.user_id,p.name,' +
    'p.description,p.category,p.price,p.on_sell,p.image from wishlist w inner join products p on p.id = w.product_id');
    return result.rows;
  }

  async getWishlistById(id) {
    const query = {
      text: 'select * from wishlist w inner join products p on p.id = w.product_id where w.id = $1',
      values: [id],
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
