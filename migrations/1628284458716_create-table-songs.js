/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    email: {
      type: 'VARCHAR(50)',
      unique: true,
      notNull: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    phone_number: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    saldo: {
      type: 'float',
      notNull: true,
    },
    profile_image: {
      type: 'text',
    },
    cover_image: {
      type: 'text',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
