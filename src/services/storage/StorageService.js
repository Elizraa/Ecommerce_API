const AWS = require('aws-sdk');

const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class StorageService {
  constructor() {
    this._S3 = new AWS.S3();
  }

  writeFile(file, meta) {
    const parameter = {
      Bucket: process.env.AWS_BUCKET_NAME, // Nama S3 Bucket yang digunakan
      Key: +new Date() + meta.filename, // Nama berkas yang akan disimpan
      Body: file._data, // Berkas (dalam bentuk Buffer) yang akan disimpan
      ContentType: meta.headers['content-type'], // MIME Type berkas yang akan disimpan
    };

    return new Promise((resolve, reject) => {
      this._S3.upload(parameter, (error, data) => {
        if (error) {
          return reject(error);
        }
        return resolve(data.Location);
      });
    });
  }

  async insertTable(ownerId, fileLocation) {
    const id = `image-${nanoid(16)}`;
    const pictureUrl = `http://${process.env.HOST}:${process.env.PORT}/file/images/${fileLocation}`;
    const query = {
      text: 'INSERT INTO productimage VALUES($1, $2, $3) RETURNING id',
      values: [id, pictureUrl, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Image gagal ditambahkan pada table');
    }
    return result.rows[0];
  }

  async getImage(ownerId) {
    const query = {
      text: 'SELECT image from productimage where owner_id = $1',
      values: [ownerId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Image tidak ditemukan');
    }
    return result.rows[0];
  }
}

module.exports = StorageService;
