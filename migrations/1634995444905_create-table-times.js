/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
   pgm.createTable('times', {
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
       notNull: false,
        },
     event: {
      type: 'text',
      notNull: true
      },
     timestamp : {
      type : 'timestamp',
      notNull :true
        }
      });
    
      pgm.addConstraint('timesr', 'fk_timess.users_id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
      pgm.addConstraint('orders', 'fk_times.product_id', 'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE');

};

exports.down = (pgm) => {
  pgm.dropTable('times');
};
