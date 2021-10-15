const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class OrdersService {
  constructor(collaborationService, cacheService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
  }

  async addOrder({ userbuyerId, productId }) {
    const id = `order-${nanoid(16)}`;
    const status = true;
    const date = new Date().toISOString();
    const querySeller = {
      text: 'select user_id from products where id = $1',
      values: [productId],
    };
    const sellerId = await this._pool.query(querySeller).rows[0];
    console.log(sellerId);
    const query = {
      text: 'insert into orders values($1, $2, $3, $4, $5, $6, productId) returning id',
      values: [id, status, date, userbuyerId, sellerId, productId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Order gagal ditambahkan');
    }

    const queryBuyer = {
      text: 'update products set user_id = $1 where id = $2',
      values: [userbuyerId, productId],
    };

    await this._pool.query(queryBuyer);

    return result.rows[0].id;
  }

  async getOrders(owner) {
    try {
      const result = await this._cacheService.get(`owner-${owner}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `select orders.id, orders.name, users.username from orders
        LEFT JOIN collaborations ON collaborations.order_id = orders.id
        LEFT JOIN users ON users.id = orders.owner 
        WHERE orders.owner = $1 OR collaborations.user_id = $1
        GROUP BY orders.id, users.username;`,
        values: [owner],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(`owner-${owner}`, JSON.stringify(result.rows));
      return result.rows;
    }
  }

  async deleteOrderById(id) {
    const query = {
      text: 'delete from orders where id = $1 returning id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Order gagal dihapus. Id tidak ditemukan');
    }
    await this._cacheService.delete(`owner-${id}`);
    await this._cacheService.delete(`orderSongs-${id}`);
  }

  async postAddSongToOrderById(orderId, songId) {
    const id = `orderSong-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO ordersongs(id,order_id,song_id) VALUES($1, (select id from orders where id = $2), (select id from songs where id = $3)) RETURNING id',
      values: [id, orderId, songId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Order tidak ditemukan');
    }
    await this._cacheService.delete(`orderSongs-${orderId}`);
  }

  async getSongInOrderById(orderId) {
    try {
      const result = await this._cacheService.get(`orderSongs-${orderId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `Select songs.id, songs.title, songs.performer from songs
        Left join ordersongs p on p.song_id = songs.id
        where p.order_id = $1`,
        values: [orderId],
      };
      const result = await this._pool.query(query);
      await this._cacheService.set(`orderSongs-${orderId}`, JSON.stringify(result.rows));
      return result.rows;
    }
  }

  async deleteSongInOrderById(orderId, songId) {
    const query = {
      text: 'delete from ordersongs where song_id = $1 AND order_id = $2 returning id',
      values: [songId, orderId],
    };
    const result = await this._pool.query(query);

    await this._cacheService.delete(`orderSongs-${orderId}`);
    return result;
  }

  async verifyOrderOwner(orderId, owner) {
    const query = {
      text: 'SELECT * FROM orders WHERE id = $1',
      values: [orderId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Orders tidak ditemukan');
    }
    const order = result.rows[0];
    if (order.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyOrderAccess(orderId, userId) {
    try {
      await this.verifyOrderOwner(orderId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationService.verifyCollaborator(orderId, userId);
      } catch {
        throw error;
      }
    }
  }

  async verifySongId(songId) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [songId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new ClientError('Lagu tidak ditemukan');
    }
  }
}

module.exports = OrdersService;
