const express = require("express");
const env = require("./config/environment");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
require("./config/view_helper")(app);
const port = 8000;
const cors = require("cors");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const mongoConnect = require("./config/mongoose");
//used for session cookie
//express-session is use to create the cookie(session) and encrypt it
const db = mongoConnect();
const session = require("express-session");

const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth-strategy2");
const MongoStore = require("connect-mongo");
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const chatServer = require("http").Server(app);
const chatSockets = require("./config/chat_socket").chatSockets(chatServer);
chatServer.listen(5000);
//console.log("Chat server is listening on port 5000");
if (env.name == "devlopment") {
  app.use(
    sassMiddleware({
      src: path.join(__dirname, env.asset_path, "scss"),
      dest: path.join(__dirname, env.asset_path, "css"),
      debug: true,
      outputStyle: "extended",
      prefix: "/css",
    })
  );
}

//console.log(path.join(__dirname, env.asset_path, "scss"));
//console.log(path.join(__dirname, env.asset_path, "css"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(env.asset_path));
//make the upload path available to browser
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(logger(env.morgan.mode, env.morgan.options));
app.use(expressLayouts);
//extract link (style) and script from sub pages to layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//set up view engine
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(
  session({
    name: "SocialHub",
    secret: env.session_cookie_key,
    store: MongoStore.create(
      {
        mongoUrl: "mongodb://127.0.0.1:27017/socialhub_development",
        autoRemove: "disabled",
      },
      function (err) {
        if (err) {
          console.error("Error while setting up MongoStore:", err);
        } else {
          //console.log("MongoStore set up successfully");
        }
      }
    ),
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
//use express router
app.use("/", require("./routes/index"));
app.listen(port, async (err) => {
  if (err) {
    console.log(`error while connecting server ${err}`);
    return;
  }
  //console.log("Server is running on port", port);
});
