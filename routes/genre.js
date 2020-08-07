const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { auth } = require("../middleware/auth");
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Genre = new mongoose.model("Genre", genreSchema);

router.get("/", async (req, res) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    res.status(404).send("resourse not found");
    return;
  }

  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  validation(req, res);

  let new_genre = new Genre({
    name: req.body.name,
  });
  await new_genre.save();
  res.send(new_genre);
});

router.put("/:id", async (req, res) => {
  validation(req, res);
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  if (!genre) {
    res.status(404).send("resourse not found");
    return;
  }
  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) {
    res.status(404).send("resourse not found");
    return;
  }
  res.send(genre);
});
function validation(req, res) {
  const schema = Joi.object({
    name: Joi.string().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send("bad input");
    return;
  }
}

module.exports = router;
