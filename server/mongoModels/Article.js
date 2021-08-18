const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  id: Number,
  title: String,
  content: String,
  author: String,
  datePosted: Date,
});

module.exports = mongoose.model("Articles", schema, "Articles");
