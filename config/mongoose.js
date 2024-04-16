const mongoose = require("mongoose");
const env = require("./environment");
console.log(env.db);
mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error"));
db.on("open", () => {
  //console.log("Connected to MongoDB");
});
module.exports = db;
