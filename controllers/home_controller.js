module.exports.home = async (req, res) => {
  try {
    res.render("home", {
      title: "Home",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
