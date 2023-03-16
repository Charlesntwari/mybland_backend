const jwt = require ("jsonwebtoken");
const dotenv = require("dotenv/config");
const generateToken = (data) => {
  return jwt.sign(data, process.env.JWT_KEY, { expiresIn: "1d" });
};
 const decodeToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY);
};
module.exports = { generateToken, decodeToken };