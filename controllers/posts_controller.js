module.exports.posts = async (req, res) => {
  try {
    res.end("<h1>Manika</h1>");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
