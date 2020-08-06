const mongoose = require("mongoose");
const express = require("express");
const app = express();
const genre = require("./routes/genre");
const customer = require("./routes/customer");
const movie = require("./routes/movies");
const rental = require("./routes/rental");
const user = require("./routes/user");
const auth = require("./routes/auth");
const config = require("config");

mongoose
  .connect("mongodb://localhost/video_app")
  .then(() => console.log("connected to server...."))
  .catch((err) => console.log(err.message));

app.use(express.json());

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey not set...");
  process.exit(1);
}

app.use("/api/genre", genre);
app.use("/api/customer", customer);
app.use("/api/movie", movie);
app.use("/api/rental", rental);
app.use("/api/user", user);
app.use("/api/auth", auth);

app.listen((PORT = 3000));
