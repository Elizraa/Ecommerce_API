const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModel } = require('../../utils');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class ProductsService {
  constructor() {
    this._pool = new Pool();
  }

  async addProduct({
    name, description, category, price, onSell, userId,
  }) {
    const id = `product-${nanoid(16)}`;

    const query = {
      text: 'insert into products values($1, $2, $3, $4, $5, $6, $7) returning id',
      values: [id, name, description, category, price, onSell, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Product gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getProducts() {
    const result = await this._pool.query('select * from products');
    return result.rows.map(mapDBToModel);
  }

  async getProductsOnSell() {
    const result = await this._pool.query('select * from products where on_sell');
    return result.rows.map(mapDBToModel);
  }

  async getProductById(id) {
    const query = {
      text: 'select * from products where id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Product tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async getProductByUserId(UserId) {
    const query = {
      text: 'select * from products where user_id = $1',
      values: [UserId],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Product tidak ditemukan');
    }

    return result.rows;

    // return result.rows.map(mapDBToModel)[0];
  }

  async editProductById(id, {
    name, description, category, price, onSell,
  }) {
    const query = {
      text: 'update products set name = $1, description = $2, category = $3, price = $4, on_sell = $5 where id = $6 returning id',
      values: [name, description, category, price, onSell, id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui product. Id tidak ditemukan');
    }
  }

  async deleteProductById(id) {
    const query = {
      text: 'delete from products where id = $1 returning id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Product gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = ProductsService;
