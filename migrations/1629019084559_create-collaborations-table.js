/* eslint-disable max-len */
/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('wishlist', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    product_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    }
  });

  pgm.addConstraint('wishlist', 'unique_playlist_id_and_user_id', 'UNIQUE(user_id, product_id)');

  pgm.addConstraint('wishlist', 'fk_wishlist.product_id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');
  pgm.addConstraint('wishlist', 'fk_wishlist.user_id_users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('wishlist');
};
