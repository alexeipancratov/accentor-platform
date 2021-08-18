const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const config = require("./config.json");

const articlesRouter = require("./routes/articlesRouter")();

mongoose
  .connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => console.log("Mongoose connected successfully"),
    (err) => console.log("Mongoose could not connect to database " + err)
  );

app.use(cors());
app.use(express.json());

app.use("/articles", articlesRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(config.serverPort, () => {
  console.log(`Example app listening at http://localhost:${config.serverPort}`);
});
