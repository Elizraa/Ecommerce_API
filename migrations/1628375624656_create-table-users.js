/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('products', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    name: {
      type: 'text',
      notNull: true,
    },
    description: {
      type: 'text',
      notNull: true,
    },
    category: {
      type: 'text',
      notNull: true,
    },
    price: {
      type: 'integer',
      notNull: true,
    },
    stock: {
      type: 'integer',
      notNull: true,
    },
    seller_id: {
      type: 'text',
      notNull: true,
    },
  });
  pgm.addConstraint('products', 'fk_products.seller_id_users.id', 'FOREIGN KEY(seller_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('products');
};
