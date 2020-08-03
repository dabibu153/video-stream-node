const mongoose = require("mongoose");
const express = require("express");
const app = express();
const genre = require("./routes/genre");
const customer = require("./routes/customer");
const movie = require("./routes/movies");
const rental = require("./routes/rental");

mongoose
  .connect("mongodb://localhost/video_app")
  .then(() => console.log("connected to server...."))
  .catch((err) => console.log(err.message));

app.use(express.json());

app.use("/api/genre", genre);
app.use("/api/customer", customer);
app.use("/api/movie", movie);
app.use("/api/rental", rental);
app.listen((PORT = 3000));
