/* eslint-disable camelcase */
const mapDBToModel = ({
  id,
  name,
  description,
  category,
  price,
  on_sell,
  image,
  username,
  profile_image,
}) => ({
  id,
  name,
  description,
  category,
  price,
  onSell: on_sell,
  image,
  username,
  profileImage: profile_image,
});

module.exports = { mapDBToModel };
