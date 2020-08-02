const mongoose = require("mongoose");
const express = require("express");
const app = express();
const genre = require("./routes/genre");
const customer = require("./routes/customer");

mongoose
  .connect("mongodb://localhost/video_app")
  .then(() => console.log("connected to server...."))
  .catch((err) => console.log(err.message));

app.use(express.json());

app.use("/api/genre", genre);
app.use("/api/customer", customer);
app.listen((PORT = 3000));
