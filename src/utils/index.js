/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  nama,
  description,
  category,
  price,
  on_sell,
  user_id,
  image,
}) => ({
  id,
  nama,
  description,
  category,
  price,
  onSell: on_sell,
  sellerId: user_id,
  image,
});

module.exports = { mapDBToModel };
