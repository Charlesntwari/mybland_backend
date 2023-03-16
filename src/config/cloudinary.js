const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "dvdmnpf99",
  api_key: "634669322415623",
  api_secret: "Yu21kLCmdMbBktM0uOXoZ8wNWas",
});
module.exports = cloudinary.uploader;
// cloudinary.config({
//   cloud_name: "dvdmnpf99",
//   api_key: