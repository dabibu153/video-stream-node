const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = new mongoose.model("User", userSchema);

router.post("/", async (req, res) => {
  validation(req, res);

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("user already exists...");
  }

  const new_user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(new_user.password, salt);
  new_user.password = hashed;

  new_user.save();

  const token = jwt.sign({ _id: new_user._id }, config.get("jwtPrivateKey"));
  res.header("x-auth-token", token).send("user added");
});

function validation(req, res) {
  const schema = Joi.object({
    userName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send("bad input1");
    return;
  }
}

module.exports = router;
module.exports.User = User;
