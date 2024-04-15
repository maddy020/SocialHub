const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const env = require("./environment");
// Configure the transporter for sending emails
const transporter = nodemailer.createTransport(env.smtp);

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
