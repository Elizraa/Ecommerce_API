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

    async getTimes() {
      const result = await this._pool.query('select * from Times')
      return result.rows;
    }

    async getTimesHistory(credentialId) {
      
  
      const query = {
        text: 'SELECT rows.id, rows.user_id,rows.timestamp, rows.product_id,p.name,p.description, p.category, p.price, p.image, p.on_sell ' +
        'from (SELECT *,  row_number() over (partition by product_id ORDER BY TIMESTAMP DESC) as row_number ' +
         'from times where user_id = $1 ) as rows ' + 
         'INNER JOIN PRODUCTS P ON P.ID = ROWS.PRODUCT_ID where row_number = 1',
        values: [credentialId],
      };
  
      const result = await this._pool.query(query);
  
      if (!result.rowCount) {
        throw new InvariantError('Times gagal ditambahkan');
      }
      // await this._cacheService.delete(`owner-${userId}`);
      return result.rows
    }

    async getTimesRec() {
      const result = await this._pool.query(
        'SELECT * FROM PRODUCTS P '+
        'INNER JOIN (SELECT PRODUCT_ID,COUNT(*) FROM TIMES ' +
        'GROUP BY PRODUCT_ID ORDER BY COUNT DESC) AS c ' + 
        'ON P.id = c.product_id'
        )
      return result.rows;
    }
  
  }

  
module.exports = TimesService;