/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('orders', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    customer_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    product_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    quantity: {
      type: 'integer',
      notNull: true,
    },
    status: {
      type: 'boolean',
      notNull: true,
    },
  });
  pgm.addConstraint('orders', 'fk_orders.customer_id_users.id', 'FOREIGN KEY(customer_id) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('orders', 'fk_orders.product_id_pruducts.id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('orders');
};
