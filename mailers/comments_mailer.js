const nodeMailer = require("../config/nodemailer");

exports.newComment = async (post, comment) => {
  // Mark the function as async
  try {
    let htmlString = await nodeMailer.renderTemplate(
      // Await the rendering result
      { post: post, comment: comment },
      "/comments/new_comment.ejs"
    );

    nodeMailer.transporter.sendMail(
      {
        from: "we.socialhubsite@gmail.com", // Corrected the email typo
        to: post.user.email,
        subject: "New Comment Published!!",
        html: htmlString, // Use the awaited HTML string
      },
      (err, info) => {
        if (err) {
          console.log("Error in sending the mail", err);
          return;
        }
        //console.log("Message sent!!", info);
      }
    );
  } catch (err) {
    console.error("Error in sending email: ", err);
  }
};
