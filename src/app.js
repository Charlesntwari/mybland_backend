const express = require('express');
const mongoose = require('mongoose');
const Blog = require("./models/blog");
const User = require("./models/user");
const Joi = require("joi");
const { validateSignup } = ('./validation');
const document = require('./swagger');
const fileUploader =require("express-fileupload");
const imageUpload = require("./imageUpload");
const Querry = require('./models/querries');
const dotenv = require("dotenv").config();
const { protect } = require("./authorization");
const {checkUser} = require("./validate");
const { generateToken } =require( "./token");
const {isPasswordMatching} = require("./hashed");


const app = express();
app.use(express.json());
app.use("/mybrand", document);
app.use(fileUploader({ useTempFiles: true }));

//connecting to mongodb
const dbURI =
  "mongodb+srv://charles:charles12345@mybland.6hfcna7.mongodb.net/mybland-data?retryWrites=true&w=majority";
mongoose.connect(dbURI)
.then((results) => app.listen(8000,() =>console.log('server running on port 8000')))
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
        res.status(401).json({ message: "User Not Authorized to create blog" });
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        message: error.message,
      });
    }
});

 // fetching all blogs

app.get("/blogs", async (req, res) => {
  try{
    const allblogs = await Blog.find()
    res.status(200).json({
      status:'they are found',
      data: allblogs
    })
  }
  catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: error.message
    })
  }
});

 // getting single blog

app.get("/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oneblog = await Blog.findById(id);
    res.status(200).json({
      status: "it is found",
      data: oneblog
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
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
        message: `blog not found`
      });
    }
    res.status(200).json({
      status: "Blog is found",
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
        message: `blog not found`
      });
    }
    res.status(200).json({
      status: "blog Deleted"
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
 
// const querrySchema = Joi.object({
//   name: Joi.string().min(3).max(50).required(),
//   email: Joi.string().email().required(),
//   message: Joi.string().min(3).max(50).required(),
// });
// adding user

app.post('/sign-up', checkUser, async (req,res) =>{
  const { error, value } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { fullname, email, username, password } = value;
   
    try {
      let newUser = await User.create(req.body);
      if(!newUser){
      return res.status(404).json({
        status: "user failed",
        data: newUser,
      });}
      return res.status(201).json({
        status: "user created successful",
        data: newUser,});
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        message: error.message,
      });
    }
});
   

 // fetching all users

app.get("/users", async (req, res) => {
  try{
    const allUsers = await User.find()
    res.status(200).json({
      status:'users found',
      data: allUsers
    })
  }
  catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: error.message
    })
  }
});

 // getting user

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleUser = await User.findById(id);
    res.status(200).json({
      status: "it is found",
      data: singleUser
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
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
        message: `user not found`,
      });
    }
    res.status(200).json({
      status: "user found",
      data: singleUser
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
        message: `Bad Request`,
      });
    }
    res.status(200).json({
      status: "Deleted",
      data: singleUser
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});

//login
app.post('/log-in', async (req,res) =>{
  try {
    let { email, password } = req.body;
    const user = await User.findOne({ email });
    // let user = await User.findOne({
    //   email,
    //   password
    // });
    if(!user){
      return res.status(400).json({
        message: 'not matching any user'
      });
    }
    if (isPasswordMatching(password, user.password)) {
      user.password = null;
      const token = generateToken({ user });
      return res.status(200).json({
        message: "logged in succefully",
        token,
      });
    } else {
      return res.status(400).json({ 
        message: "incorrect password" 
      });
    }
  }catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
})

//Query

// adding user

app.post('/querry', async (req,res) =>{
  const { error, value } = querrySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { name, email, message } = value;
    try {
      let newQuerry = await Querry.save();
      res.status(201).json({
        status: "Querry sent successfully",
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
  try{
    const allQuerries = await Querry.find()
    res.status(200).json({
      status:'All Querries found successfully',
      data: allQuerries
    })
  }
  catch (error) {
    console.log(error.message)
    res.status(500).json({
      message: error.message
    })
  }
});

 // getting single querry

app.get("/querries/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singleQuerry = await Querry.findById(id);
    res.status(200).json({
      status: "it is found",
      data: singleQuerry
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message
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
        message: `querry not found`,
      });
    }
    res.status(200).json({
      status: "Deleted",
      data: singleQuerry
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: error.message,
    });
  }
});
