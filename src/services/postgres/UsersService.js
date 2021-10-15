const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this._pool = new Pool();
  }

  async addUser({
    name, email, phoneNumber, password,
  }) {
    await this.verifyNewName(name);
    await this.verifyNewEmail(email);
    const id = `user-${nanoid(16)}`;
    const saldo = Math.random() * 10;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6) RETURNING id,seller',
      values: [id, name, email, phoneNumber, hashedPassword, saldo],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }

    const ids = result.rows[0].id;
    const sellers = result.rows[0].seller;
    console.log(sellers);
    return { ids, sellers };
  }

  async verifyNewName(name) {
    const query = {
      text: 'SELECT name FROM users WHERE name = $1',
      values: [name],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan, username sudah digunakan.');
    }
  }

  async verifyNewEmail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal menambahkan, email sudah digunakan.');
    }
  }

  async getUserById(userId) {
    const query = {
      text: 'SELECT id, name, phone_number, saldo FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteUserByEmail(email, password) {
    await this.verifyUserCredential(email, password);
    const query = {
      text: 'DELETE FROM users WHERE email = $1 returning id',
      values: [email],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
  }

  async verifyUserCredential(email, password) {
    const query = {
      text: 'SELECT id, password, seller FROM users WHERE email = $1',
      values: [email],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    const { id, password: hashedPassword, seller } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    return { id, seller };
  }

  async getUsersByName(name) {
    const query = {
      text: 'SELECT id, name, phone_number, saldo FROM users WHERE name LIKE $1',
      values: [`%${name}%`],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = UsersService;
