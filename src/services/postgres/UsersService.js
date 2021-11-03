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
    name, email, phoneNumber, nationality, password,
  }) {
    await this.verifyNewName(name);
    await this.verifyNewEmail(email);
    const id = `user-${nanoid(16)}`;
    const saldo = Math.random() * 10;
    const hashedPassword = await bcrypt.hash(password, 10);
    const profile = 'https://ecomreceappbucket-wrpl.s3.ap-southeast-1.amazonaws.com/user_profile_default.svg';
    const cover = 'https://ecomreceappbucket-wrpl.s3.ap-southeast-1.amazonaws.com/user_cover_default.jpg';
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      values: [id, email, name, phoneNumber, nationality, hashedPassword, saldo, profile, cover],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan');
    }
    return result.rows[0].id;
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
      text: 'SELECT id, name, phone_number, saldo, profile_image, cover_image, nationality FROM users WHERE id = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return result.rows[0];
  }

  async getUsersSaldoHighest() {
    const query = {
      text: 'Select id, name, saldo, profile_image from users order by saldo desc limit 7',
    };
    console.log('aaa');
    const result = await this._pool.query(query);
    return result.rows;
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
      text: 'SELECT id, password FROM users WHERE email = $1',
      values: [email],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    const { id, password: hashedPassword } = result.rows[0];

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }
    return id;
  }

  async getUsersByName(name) {
    const query = {
      text: 'SELECT name, phone_number, saldo, profile_image, cover_image, nationality FROM users WHERE name = $1',
      values: [name],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async insertProfileImage(id, url) {
    const query = {
      text: 'update users set profile_image = $1 where id = $2 returning id',
      values: [url, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return result.rows[0];
  }

  async insertCoverImage(id, url) {
    const query = {
      text: 'update users set cover_image = $1 where id = $2 returning id',
      values: [url, id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('User tidak ditemukan');
    }
    return result.rows[0];
  }
}

module.exports = UsersService;
