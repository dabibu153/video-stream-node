const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Joi = require("joi");

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 25,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 3,
    max: 20,
  },
});

const Movie = new mongoose.model("Movie", movieSchema);

router.get("/", async (req, res) => {
  const movies = await Movie.find()
    .populate("genre", "name -_id")
    .select("name genre -_id");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id)
    .populate("genre", "name -_id")
    .select("name genre -_id");

  if (!movie) {
    res.status(404).send("resourse not found");
    return;
  }

  res.send(movie);
});

router.post("/", async (req, res) => {
  validation(req, res);

  let new_movie = new Movie({
    name: req.body.name,
    genre: req.body.genre,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await new_movie.save();
  res.send(new_movie);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) {
    res.status(404).send("resourse not found");
    return;
  }
  res.send(movie);
});
function validation(req, res) {
  const schema = Joi.object({
    name: Joi.string().required(),
    genre: Joi.string().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send("bad input");
    return;
  }
}

module.exports = router;
module.exports.Movie = Movie;
