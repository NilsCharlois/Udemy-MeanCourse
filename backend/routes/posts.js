const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}


// use diskStorage to have full control on storing files on disk
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    // check that the mime type is in the list of supported mime types
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid){
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    // rename the file when storing it
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});


// to add a new post
router.post("", multer({storage: storage}).single("image"), (req, res, next)=>{
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(createdPost=>{
    res.status(201).json({
      message: "Post added successfully!",
      post: {
        ...createdPost,
        id: createdPost._id, // need to remap the id
      }
    });
  });
});

// to patch posts
router.put("/:id",
 multer({storage: storage}).single("image"),
 (req,res,next)=>{
   console.log(req.file);
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
Post.updateOne({_id: req.params.id}, post).then(result=>{
  console.log(result);
  res.status(200).json({message: "Update successful!"});
});
});

// to get all posts
router.get("", (req, res, next)=> {
  Post
  .find()
  .then(documents=>{
    res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: documents
  });
  });
});

router.get("/:id", (req,res,next)=>{
  Post.findById(req.params.id).then(post=>{
    if(post){
      // post found
      res.status(200).json(post);
    } else{
      req.status(404).json({message:"Post not found!"});
    }
  })
});

router.delete("/:id", (req, res, next)=>{
  Post.deleteOne({_id: req.params.id})
  .then(result=>{
    console.log(result);
  });
  res.status(200).json({ message: "Post deleted!"});
});

module.exports = router;
