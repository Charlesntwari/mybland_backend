
const { hashPassword, isPasswordMatching } = require("./hashed");
// import { generateToken } from "./token";
const userModel = require("./models/user");
const checkUser = async (req, res, next) => {
  let { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    req.body.password = hashPassword(password);
    return next();
  }
  return res.status(409).json({
    status: "user already exist",
  });
};
module.exports = { checkUser };
