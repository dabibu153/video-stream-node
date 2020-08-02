const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isGold: Boolean,
  phone: {
    type: Number,
    required: true,
  },
});

const Customer = new mongoose.model("Customer", customerSchema);

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404).send("resourse not found");
    return;
  }

  res.send(customer);
});

router.post("/", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    isGold: Joi.bool(),
    phone: Joi.number(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send("bad input");
    return;
  }
  let new_customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  await new_customer.save();
  res.send(new_customer);
});

router.put("/:id", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    isGold: req.body.isGold,
    phone: req.body.phone,
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send("bad input");
    return;
  }
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
    { new: true }
  );

  if (!customer) {
    res.status(404).send("resourse not found");
    return;
  }
  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer) {
    res.status(404).send("resourse not found");
    return;
  }
  res.send(customer);
});

module.exports = router;
