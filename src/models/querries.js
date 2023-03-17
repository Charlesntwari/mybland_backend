const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const querrySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

const Querry = mongoose.model("Querry", querrySchema);
module.exports = Querry;
