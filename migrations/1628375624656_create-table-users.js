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
      type: 'float8',
      notNull: true,
    },
    on_sell: {
      type: 'boolean',
      notNull: true,
    },
    creator_commission: {
      type: 'float8',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    creator_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    image: {
      type: 'text',
    },
  });
  pgm.addConstraint('products', 'fk_products.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('products', 'fk_products.creator_id_users.id', 'FOREIGN KEY(creator_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('products');
};
