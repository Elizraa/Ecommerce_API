const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const ClientError = require('../../exceptions/ClientError');

class OrdersService {
  constructor() {
    this._pool = new Pool();
    // this._cacheService = cacheService;
  }

  async addOrder(userbuyerId, productId) {
    const saldoAkhir = await this.verifySaldo(userbuyerId, productId);
    const id = `order-${nanoid(16)}`;
    const status = true;
    const date = new Date().toISOString();
    const querySeller = {
      text: 'select user_id from products where id = $1',
      values: [productId],
    };
    const result1 = await this._pool.query(querySeller);
    const { user_id: userId } = result1.rows[0];
    const query = {
      text: 'insert into orders values($1, $2, $3, $4, $5, $6) returning id',
      values: [id, status, date, userbuyerId, userId, productId],
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

    const queryBuyerSaldo = {
      text: 'Update users set saldo = $1 where id=$2',
      values: [saldoAkhir, userbuyerId],
    };

    await this._pool.query(queryBuyerSaldo);

    return result.rows[0].id;
  }

  async getOrdersBuyer(userId) {
    // try {
    //   const result = await this._cacheService.get(`owner-${owner}`);
    //   return JSON.parse(result);
    // } catch (error) {
    // }
    const query = {
      text: 'Select o.id, o.date, o.product_id, p.name, p.image, p.price, u.name sellername, u.profile_image userProfil from orders o inner join products p on p.id = o.product_id inner join users u on u.id = o.userseller_id where o.userbuyer_id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    // await this._cacheService.set(`owner-${owner}`, JSON.stringify(result.rows));
    return result.rows;
  }

  async getOrdersSeller(userId) {
    const query = {
      text: 'Select o.id, o.date, o.product_id, p.name, p.image, p.price, u.name buyername, u.profile_image userProfil from orders o inner join products p on p.id = o.product_id inner join users u on u.id = o.userbuyer_id where o.userseller_id = $1',
      values: [userId],
    };
    const result = await this._pool.query(query);
    return result.rows;
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
    // await this._cacheService.delete(`owner-${id}`);
    // await this._cacheService.delete(`orderSongs-${id}`);
  }

  async getOrderDetailById(orderId) {
    // try {
    // const result = await this._cacheService.get(`orderSongs-${orderId}`);
    // return JSON.parse(result);
    // } catch (error) {

    // }
    const query = {
      text: 'Select * from orders where id = $1',
      values: [orderId],
    };
    const result = await this._pool.query(query);
    // await this._cacheService.set(`orderSongs-${orderId}`, JSON.stringify(result.rows));
    return result.rows;
  }

  async getSellerDetailById(sellerId) {
    const query = {
      text: 'Select name, profile_image from users where id = $1',
      values: [sellerId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyProductId(productId) {
    const query = {
      text: 'SELECT * FROM products WHERE id = $1',
      values: [productId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new ClientError('Product tidak ditemukan');
    }
  }

  async verifySaldo(buyerId, productId) {
    const query1 = {
      text: 'Select saldo from users where id = $1',
      values: [buyerId],
    };
    const result1 = await this._pool.query(query1);

    const { saldo: saldoBuyer } = result1.rows[0];

    const query2 = {
      text: 'Select price from products where id = $1',
      values: [productId],
    };
    const result2 = await this._pool.query(query2);
    const { price: harga } = result2.rows[0];
    const sisaSaldo = saldoBuyer - harga;
    if (sisaSaldo < 0) {
      throw new ClientError('Saldo buyer tidak mencukupi');
    }
    return sisaSaldo;
  }
}

module.exports = OrdersService;
