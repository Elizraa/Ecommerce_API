/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  nama,
  description,
  category,
  price,
  stock,
  on_sell,
  user_id,
}) => ({
  id,
  nama,
  description,
  category,
  price,
  stock,
  onSell: on_sell,
  sellerId: user_id,
});

module.exports = { mapDBToModel };
