/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  nama,
  description,
  category,
  price,
  stock,
  seller_id,
}) => ({
  id,
  nama,
  description,
  category,
  price,
  stock,
  sellerId: seller_id,
});

module.exports = { mapDBToModel };
