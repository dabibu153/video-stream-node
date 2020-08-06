const { User } = require("./user");
const Joi = require("joi");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

router.post("/", async (req, res) => {
  validation(req, res);

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("invalid username or password...");
  }

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send("invalid username or password...");
  }

  const token = await jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));

  res.send(token);
});

function validation(req, res) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send("bad input123");
    return;
  }
}

module.exports = router;
