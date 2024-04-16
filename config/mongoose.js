const mongoose = require("mongoose");
const env = require("./environment");
console.log(env.db);

async function mongoConnect() {
  try {
    mongoose.connect(`mongodb://127.0.0.1:27017/${env.db}`);
    const db = await mongoose.connection;
    await db.on(
      "error",
      console.error.bind(console, "MongoDB connection error")
    );
    await db.on("open", () => {
      //console.log("Connected to MongoDB");
    });
    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.log(error);
  }
}

module.exports = mongoConnect;
