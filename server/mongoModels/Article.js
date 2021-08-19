const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: Number,
  title: String,
  content: String,
  author: String,
  datePosted: Date,
  image: String,
});

module.exports = mongoose.model("Articles", schema, "Articles");
