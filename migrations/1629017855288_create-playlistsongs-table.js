/* eslint-disable max-len */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('productimage', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    image: {
      type: 'text',
      notNull: true,
    },
    owner_id: {
      type: 'text',
      notNull: true,
    },
  });

  pgm.addConstraint('productimage', 'fk_product_image.owner_id_product.id', 'FOREIGN KEY(owner_id) REFERENCES products(id) ON DELETE CASCADE');
  pgm.addConstraint('productimage', 'fk_product_image.owner_id_user.id', 'FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('productimage');
};
