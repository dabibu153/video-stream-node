const express = require("express");
const app = express();

app.use(express.json());

const Joi = require("joi");

genre_list = [
  { id: 1, name: "comedy", movies: ["movie.1", "movie.2", "movie.3"] },
  { id: 2, name: "action", movies: ["movie.4", "movie.5", "movie.6"] },
  { id: 3, name: "horror", movies: ["movie.7", "movie.8", "movie.9"] },
  { id: 4, name: "sci-fi", movies: ["movie.10", "movie.11", "movie.12"] },
  { id: 5, name: "animation", movies: ["movie.13", "movie.14", "movie.15"] },
];

app.get("/api/genres", (req, res) => {
  res.send(genre_list);
});

app.get("/api/genres/:id", (req, res) => {
  const genre = genre_list.find((c) => c.id === parseInt(req.params.id));

  if (!genre) {
    res.status(404).send("resourse not found");
    return;
  }

  res.send(genre);
});

app.post("/api/genres", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    movies: Joi.array().min(1).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400);
    return;
  }
  const new_genre = {
    id: genre_list.length + 1,
    name: req.body.name,
    movies: req.body.movies,
  };
  genre_list.push(new_genre);
  res.send(new_genre);
});

app.put("/api/genres/:id", (req, res) => {
  const genre = genre_list.find((c) => c.id === parseInt(req.params.id));

  if (!genre) {
    res.status(404).send("resourse not found");
    return;
  }
  const schema = Joi.object({
    name: Joi.string().required(),
    movies: Joi.array().min(1).required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send("bad input");
    return;
  }

  genre.name = req.body.name;
  genre.movies = req.body.movies;
  res.send(genre);
});

app.delete("/api/genres/:id", (req, res) => {
  const genre = genre_list.find((c) => c.id === parseInt(req.params.id));

  if (!genre) {
    res.status(404).send("resourse not found");
    return;
  }

  const index = genre_list.indexOf(genre);
  genre_list.splice(index, 1);
  res.send(genre);
});

app.listen((PORT = 3000));
