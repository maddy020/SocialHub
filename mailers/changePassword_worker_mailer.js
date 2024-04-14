const nodeMailer = require("../config/nodemailer");

exports.changePassword = async (accessToken) => {
  // Added async keyword here
  //console.log("token***", accessToken);
  try {
    // Await the resolution of the HTML string from the template
    let htmlString = await nodeMailer.renderTemplate(
      { accessToken: accessToken },
      "/changePassword/changePassword.ejs"
    );
    //console.log("htmlstring******", htmlString);
    nodeMailer.transporter.sendMail(
      {
        from: "we.socialhubsite@gmail.com",
        to: accessToken.user.email,
        subject: "Changing the Password!!",
        html: htmlString, // This now holds the actual HTML string, not a Promise
      },
      (err, info) => {
        if (err) {
          console.log("Error in sending the mail", err);
          return;
        }
        //console.log("Message sent!!", info);
        return;
      }
    );
  } catch (err) {
    console.log("Error in rendering template or sending mail", err);
  }
};
