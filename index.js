const express = require("express");
const port = 8000;

const app = express();

app.listen(port, async (err) => {
  if (err) {
    console.log(`error while connecting server ${err}`);
    return;
  }
  console.log("Server is running on port", port);
});
