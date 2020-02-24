const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post')

const app = express();

// connect to mongodb cloud
mongoose
.connect("mongodb+srv://nils:syW9NQmmgpmBxgyI@cluster0-1zedl.mongodb.net/test?retryWrites=true&w=majority")
.then(()=>{
  console.log("Connected to database!");
}).catch(()=>{
  console.log("Connection failed");
});

// to parse json body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res, next)=>{
  res.setHeader(
    "Access-Control-Allow-Origin",
    "*"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATH, DELETE, OPTIONS"
  );
  next();
});

// to add a new post
app.post("/api/posts", (req, res, next)=>{
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost=>{
    res.status(201).json({
      message: "Post added successfully!",
      postId: createdPost._id
    });
  });
});

// to get all posts
app.get("/api/posts", (req, res, next)=> {
  Post
  .find()
  .then(documents=>{
    res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: documents
  });
  });
});

app.delete("/api/posts/:id", (req, res, next)=>{
  Post.deleteOne({_id: req.params.id})
  .then(result=>{
    console.log(result);
  });
  res.status(200).json({ message: "Post deleted!"});
});

module.exports = app;
