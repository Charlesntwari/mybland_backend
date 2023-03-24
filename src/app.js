const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const User = require("./models/user");
const Joi = require("joi");
const { validateSignup } = "./validation";
const document = require("./swagger");
const fileUploader = require("express-fileupload");
const imageUpload = require("./imageUpload");
const Querry = require("./models/querries");
const dotenv = require("dotenv").config();
const { protect } = require("./authorization");
const { checkUser } = require("./validate");
const { generateToken } = require("./token");
const { isPasswordMatching } = require("./hashed");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/mybrand", document);
app.use(fileUploader({ useTempFiles: true }));

//connecting to mongodb
const dbURI =
  //  "mongodb+srv://charles:charles12345@mybland.6hfcna7.mongodb.net/mybland-data?retryWrites=true&w=majority";
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mybland.6hfcna7.mongodb.net/mybland-data?retryWrites=true&w=majority`;

mongoose
  .connect(dbURI)
  .then((results) =>
    app.listen(8000, () => console.log("server running on port 8000"))
  )
  .catch((err) => console.log(err));

// posting blog

app.post("/blog", protect, async (req, res) => {
  let reqData = req.body;

  try {
    if (req.user.role.toString() == "admin") {
      const { image, title, body } = req.body;
      let imageUrl = "";
      if (req.files) {
        const image = await imageUpload(req);
        imageUrl = image.url;
        reqData.image = imageUrl;
      }

      const blog = await Blog.create(reqData);
      res.status(201).json({
        status: "blog created successful",
        data: blog,
      });
    } else {
      res.status(401).json({
        status: 401,
        message: "User Not Authorized to create blog",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});
app.post("/blogs/:id/comment", (req, res) => {
  const blog_id = req.params.id;
  const { user_id, comment, postedDate } = req.body;
  // console.log(blog_id);
  Blog.findById(blog_id)
    .then((blog) => {
      console.log(blog);
      blog.comments.push({
        user_id: user_id,
        comment: comment,
        postedDate: postedDate,
      });
      console.log(blog);
      blog
        .save()
        .then((result) => {
          return res
            .status(200)
            .json({ message: "commented successfully", data: result });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Something went wrong, couldn't save",
            Error: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(404).json({
        status: 404,
      });
    });
});

const likeblog = async (req, res) => {
  const  blog_id  = req.params.id;
  const user_id = req.user.id;
  const newLike = {
    user_id,
  };
  console.log(blod_id)
  blogModel
    .findOne({ _id: blog_id })
    .then((blog) => {
      if (blog) {
        const found = blog.likes.some(
          (el) => el.user_id.toString() === user_id.toString()
        );
        console.log(found);
        if (found) {
          blog.likes = blog.likes.filter(
            (item) => item.user_id.toString() !== user_id.toString()
          );
        } else {
          blog.likes.push(newLike);
        }
        blog
          .save()
          .then((result) => res.json(result))
          .catch((error) => res.status(500).json({ error: error.message }));
      } else res.status(404).json({ error: "blog doesn't exist" });
    })
    .catch((error) => res.json({ error: error.message }));
};
module.exports = { likeblog };

// fetching all blogs

app.get("/blogs", async (req, res) => {
  try {
    const allblogs = await Blog.find();
    res.status(200).json({
      status: 200,
      message: "they are found",
      data: allblogs,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

// getting single blog

app.get("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneblog = await Blog.findById(id);
    if (!oneblog) {
      return res.status(404).json({
        status: 404,
        message: `blog not found`,
      });
    }
    res.status(200).json({
      status: 200,
      message: "it is found",
      data: oneblog,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

//updating blog

app.put("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneblog = await Blog.findByIdAndUpdate(id, req.body);

    //if we can not find the blog
    if (!oneblog) {
      return res.status(404).json({
        status: 404,
        message: `blog not found`,
      });
    }
    res.status(200).json({
      status: 200,
      message: "Blog is found",
      data: oneblog,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

//Delete a blog

app.delete("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneblog = await Blog.findByIdAndDelete(id);

    //if we can not find the blog
    if (!oneblog) {
      return res.status(404).json({
        status: 404,
        message: `blog not found`,
      });
    }
    res.status(200).json({
      status: 200,
      message: "blog Deleted",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

// add a comment to a blog post

// Route to increment the like count for a blog post

//using joi for user validation validation
const signupSchema = Joi.object({
  fullname: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(3).max(500).required(),
});

const querrySchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(3).max(50).required(),
});

// adding user

app.post("/signup", checkUser, async (req, res) => {
  const { error, value } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { fullname, email, username, password } = value;

  try {
    let newUser = await User.create(req.body);
    if (!newUser) {
      return res.status(404).json({
        status: 404,
        message: "user failed",
      });
    }
    return res.status(201).json({
      status: 201,
      message: "user created successful",
      data: newUser,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

// fetching all users

app.get("/users", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.status(200).json({
      status: 200,
      message: "users found",
      data: allUsers,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

// getting user

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleUser = await User.findById(id);
    if (singleUser) {
      res.status(200).json({
        status: 200,
        massage: "it is found",
        data: singleUser,
      });
    }
    if (!singleUser) {
      return res.status(404).json({
        status: 404,
        message: "user failed",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

//updating user

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleUser = await User.findByIdAndUpdate(id, req.body);

    //if we can not find user
    if (!singleUser) {
      return res.status(404).json({
        status: 404,
        message: `user not found`,
      });
    }
    res.status(200).json({
      status: 200,
      message: "user found",
      data: singleUser,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

//Delete user

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleUser = await User.findByIdAndDelete(id);

    //if we can not find user
    if (!singleUser) {
      return res.status(404).json({
        status: 404,
        message: "no matching data",
      });
    }
    res.status(200).json({
      status: 200,
      message: "Deleted",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

//login
app.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "not matching any user",
      });
    }
    if (isPasswordMatching(password, user.password)) {
      user.password = null;
      const token = generateToken({ user });
      return res.status(200).json({
        status: 200,
        message: "logged in successfully",
        token,
        data: user,
      });
    } else {
      return res.status(400).json({
        status: 404,
        message: "incorrect password",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

//Query

// adding querry

app.post("/querry", async (req, res) => {
  const { error, value } = querrySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { name, email, message } = value;
  try {
    let newQuerry = await Querry.create(req.body);
    res.status(201).json({
      status: 201,
      message: "Querry sent successfully",
      data: newQuerry,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

// fetching all querries

app.get("/querries", async (req, res) => {
  try {
    const allQuerries = await Querry.find();
    res.status(200).json({
      status: 200,
      message: "All Querries found successfully",
      data: allQuerries,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

// getting single querry

app.get("/querries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleQuerry = await Querry.findById(id);
    if (!singleQuerry) {
      return res.status(404).json({
        status: 404,
        message: `querry not found`,
      });
    }
    res.status(200).json({
      status: 200,
      message: "it is found",
      data: singleQuerry,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

//Delete querry

app.delete("/querries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleQuerry = await Querry.findByIdAndDelete(id);

    //if querry not found
    if (!singleQuerry) {
      return res.status(404).json({
        status: 404,
        message: `querry not found`,
      });
    }
    res.status(200).json({
      status: 200,
      message: "Deleted",
      data: singleQuerry,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = app;
