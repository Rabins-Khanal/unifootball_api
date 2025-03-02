const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  news_image: {
    type: String,
    default: null,
  },
  author: {
    type: String,
    required: true,
  },
  date_published: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("News", newsSchema);
