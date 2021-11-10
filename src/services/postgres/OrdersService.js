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

  async addOrder(userbuyerId, productId, finalPrice) {
    const saldoAkhir = await this.verifySaldo(userbuyerId, finalPrice);
    const id = `order-${nanoid(16)}`;
    const status = true;
    const date = new Date().toISOString();
    const querySeller = {
      text: 'select p.user_id sellerId, p.on_sell onSell, p.creator_id creatorId, p.price, p.creator_commission creatorCommission, u.saldo sellerSaldo from products p inner join users u on p.user_id = u.id where p.id = $1',
      values: [productId],
    };
    const result1 = await this._pool.query(querySeller);

    if (!result1.rowCount) {
      throw new InvariantError('User atau product tidak ditemukan');
    }
    const {
      sellerid: sellerId,
      onsell: onSell,
      price,
      creatorid: creatorId, creatorcommission: creatorCommission, sellersaldo: sellerSaldo,
    } = result1.rows[0];

    const queryOwner = {
      text: 'select u.saldo from users where id = $1',
      values: [creatorId],
    };
    const result2 = await this._pool.query(queryOwner);
    const { saldo: saldoOwner } = result2.rows[0];

    if (userbuyerId === sellerId) {
      throw new ClientError('User yang sama');
    }

    if (!onSell) {
      throw new ClientError('Product tidak dijual');
    }

    const query = {
      text: 'insert into orders values($1, $2, $3, $4, $5, $6) returning id',
      values: [id, status, date, userbuyerId, sellerId, productId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Order gagal ditambahkan');
    }
    const onSellUpdate = false;
    const queryBuyer = {
      text: 'update products set user_id = $1, on_sell = $2 where id = $3',
      values: [userbuyerId, onSellUpdate, productId],
    };

    await this._pool.query(queryBuyer);

    const queryBuyerSaldo = {
      text: 'Update users set saldo = $1 where id=$2',
      values: [saldoAkhir, userbuyerId],
    };

    await this._pool.query(queryBuyerSaldo);

    const persenanCreator = price * (creatorCommission / 100);
    const saldoAkhriOwner = saldoOwner + persenanCreator;
    const saldoSellerAkhir = sellerSaldo + (price - persenanCreator);
    const querySellerSaldo = {
      text: 'update users set saldo = $1 where id=$2',
      values: [saldoSellerAkhir, sellerId],
    };

    await this._pool.query(querySellerSaldo);

    const queryCreatorSaldo = {
      text: 'update users set saldo = $1 where id=$2',
      values: [saldoAkhriOwner, creatorId],
    };

    await this._pool.query(queryCreatorSaldo);

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

  async verifySaldo(buyerId, finalPrice) {
    const query1 = {
      text: 'Select saldo from users where id = $1',
      values: [buyerId],
    };
    const result1 = await this._pool.query(query1);

    const { saldo: saldoBuyer } = result1.rows[0];

    // const query2 = {
    //   text: 'Select price from products where id = $1',
    //   values: [productId],
    // };
    // const result2 = await this._pool.query(query2);
    // const { price: harga } = result2.rows[0];
    const sisaSaldo = saldoBuyer - finalPrice;
    if (sisaSaldo < 0) {
      throw new ClientError('Saldo buyer tidak mencukupi');
    }
    return sisaSaldo;
  }

  async NationalityFee(buyerId, sellerNationality) {
    const queryBuyer = {
      text: 'Select u.nationality, n.tax from users u inner join nationality n on u.nationality = n.iso3 where u.id = $1',
      values: [buyerId],
    };

    const result1 = await this._pool.query(queryBuyer);

    const { nationality: buyerNationality } = result1.rows[0];

    if (buyerNationality === sellerNationality) {
      const tax = 0;
      return { buyerNationality, sellerNationality, tax };
    }
    const { tax } = result1.rows[0];
    return { buyerNationality, sellerNationality, tax };
  }

  async getTopBuyers() {
    const result = await this._pool.query(
      'select buyer_Id, sum(price),test.uname, test.profile_image from '
      + '(Select o.id, o.userbuyer_id buyer_Id,u.name uname,u.profile_image ,p.price from orders o '
      + 'inner join products p on p.id = o.product_id inner join users u on u.id = o.userbuyer_id) as test '
      + 'group by buyer_Id,test.uname,test.profile_image order by sum DESC',
    );
    return result.rows;
  }
}

module.exports = OrdersService;
