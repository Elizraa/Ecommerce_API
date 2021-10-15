/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('orders', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    status: {
      type: 'boolean',
      notNull: true,
    },
    date: {
      type: 'text',
      notNull: true,
    },
    userbuyer_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    userseller_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    product_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },

  });
  pgm.addConstraint('orders', 'fk_orders.buyer_id_users.id', 'FOREIGN KEY(userbuyer_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('orders', 'fk_orders.seller_id_users.id', 'FOREIGN KEY(userseller_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('orders', 'fk_orders.product_id_pruducts.id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('orders');
};
