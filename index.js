const express = require("express");
const app = express();
const genre = require("./routes/genre");

app.use(express.json());

app.get("/", (req, res) => {
  res.send("HomePage");
});

app.use("/api/genre", genre);
app.listen((PORT = 3000));
