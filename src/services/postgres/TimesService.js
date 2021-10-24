const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');


class TimesService {
    constructor(cacheService) {
      this._pool = new Pool();
      this._cacheService = cacheService;
    }
  
    async addTimes({
      productId, event,
    }) {
      const timestamp = new Date().toISOString();
      const id = `times-${nanoid(16)}`;
  
      const query = {
        text: 'INSERT INTO TIMES(id,product_id,event,timestamp) VALUES($1, $2, $3, $4) RETURNING id',
        values: [id, productId, event, timestamp],
      };
  
      const result = await this._pool.query(query);
  
      if (!result.rowCount) {
        throw new InvariantError('Times gagal ditambahkan');
      }
      // await this._cacheService.delete(`owner-${userId}`);
      return result.rows[0].id;
    }

    async addTimesWithUserId({
      productId, credentialId,event
    }) {
      const timestamp = new Date().toISOString();
      const id = `times-${nanoid(16)}`;
  
      const query = {
        text: 'INSERT INTO TIMES VALUES($1, $2,$3, $4, $5) RETURNING id',
        values: [id, productId,credentialId, event, timestamp],
      };
  
      const result = await this._pool.query(query);
  
      if (!result.rowCount) {
        throw new InvariantError('Times gagal ditambahkan');
      }
      // await this._cacheService.delete(`owner-${userId}`);
      return result.rows[0].id;
    }
  
  }

  
module.exports = TimesService;