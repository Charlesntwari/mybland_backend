const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  comments: [
    {
      user_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
      },
      email: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: [true, "Please add a comment"],
      },
      postedDate: {
        type: String,
        required: true,
      },
    },
  ],
  likes: [
    {
      user_id: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "User",
      },
    },
  ],
});

const Blog = mongoose.model('Blog',blogSchema);
module.exports = Blog;