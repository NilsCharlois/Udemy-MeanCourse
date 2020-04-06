const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/user');

const router = express.Router();

router.post("/signup",(req,res,next)=>{
  // create a new user and store in the DB
  bcrypt.hash(req.body.password, 10)
  .then(hash=>{
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then(result=>{
      res.status(201).json({
        message: 'User Created',
        result: result
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
  });
});

router.post("/login", (req,res,next)=>{
  let fetchedUser; // to store the user to create the token later on
  // check if email @ exists
  User.findOne({email: req.body.email})
  .then(user=>{
    // no user found, auth failed
    if(!user){
      return res.status(401).json({message:'Auth failed'});
    }
    fetchedUser = user;
    // compare user's hashed password and the body's password
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result=>{
    // if the hashes are not equals, auth failed
    if(!result){
      return res.status(401).json({message:'Auth failed'});
    }
    // else, we create a jwt token
    const token = jwt.sign(
      {email: fetchedUser.email, userId: fetchedUser._id},
      'wagukcan7cavterjurr2',
      {
        expiresIn: "1h"
      }
    );
    res.status(200).json({
      token: token
    })

  })
  .catch(err=>{
    return res.status(401).json({message:'Auth failed'});
  });
});


module.exports = router;
