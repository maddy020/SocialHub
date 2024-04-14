const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

// Configure the transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com", // corrected the host name
  port: 587,
  secure: false, // `false` for port 587, `true` for 465
  auth: {
    user: "we.socialhubsite@gmail.com",
    pass: "llky gnfy uulw dhtk",
  },
});

// Define function to render email templates
//renders view from the ejs
let renderTemplate = async (data, relativePath) => {
  try {
    const mailHTML = await ejs.renderFile(
      path.join(__dirname, "../views/mailers", relativePath),
      data
    );
    return mailHTML;
  } catch (err) {
    console.log("Error in rendering template:", err);
    return null; // or handle the error appropriately
  }
};

// Exporting the transporter and the template rendering function
module.exports = {
  transporter,
  renderTemplate,
};
