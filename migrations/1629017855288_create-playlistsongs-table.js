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

  pgm.addConstraint('productimage', 'fk_product_image.product_id_product.id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('productimage');
};
