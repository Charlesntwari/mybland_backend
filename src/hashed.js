const bcrypt= require("bcrypt");
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};
const isPasswordMatching = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = { hashPassword, isPasswordMatching };