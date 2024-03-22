const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/socialhub_development");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
db.on("open", () => {
  console.log("Connected to MongoDB");
});
module.exports = db;
