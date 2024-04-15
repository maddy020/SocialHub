const fs = require("fs");
const rfs = require("rotating-file-stream").createStream;
const path = require("path");

const logDirectry = path.join(__dirname, "../production_logs");
fs.existsSync(logDirectry) || fs.mkdirSync(logDirectry);

const accessLogStream = rfs("access.log", {
  interval: "1d",
  path: logDirectry,
});

const devlopment = {
  name: "devlopment",
  asset_path: "/assets",
  db: "socialhub_development",
  session_cookie_key: "RIaZDQKpFif69igvjBSYkBiwrVGkTldk",
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com", // corrected the host name
    port: 587,
    secure: false, // `false` for port 587, `true` for 465
    auth: {
      user: "we.socialhubsite@gmail.com",
      pass: "llky gnfy uulw dhtk",
    },
  },
  google_clientID:
    "2727485938-ocq90ndbs7sc8mbfhdnqvr6eqtvrkfgl.apps.googleusercontent.com",
  google_clientSecret: "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",
  google_callbackURL: "http://localhost:8000/users/auth/google/callback",
  jwt_secret: "DXAcWN26vHAYjll92nzSqYTi8wo93a4Y",
  morgan: {
    mode: "dev",
    options: { stream: accessLogStream },
  },
};

//console.log(process.env.SOCIALHUB_ASSET_PATH);
const production = {
  name: "production",
  asset_path: process.env.SOCIALHUB_ASSET_PATH,
  db: "codeial_production",
  session_cookie_key: process.env.SOCIALHUB_SESSION_COOKIE_KEY,
  smtp: {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.SOCIALHUB_GMAIL_USERNAME,
      pass: process.env.SOCIALHUB_GMAIL_PASSWORD,
    },
  },
  google_clientID: process.env.SOCIALHUB_GOOGLE_CLIENT_ID,
  google_clientSecret: process.env.SOCIALHUB_GOOGLE_CLIENT_SECRET,
  google_callbackURL: process.env.SOCIALHUB_GOOGLE_CALLBACK_URL,
  jwt_secret: process.env.SOCIALHUB_JWT_SECRET,
  morgan: {
    mode: "combined",
    options: { stream: accessLogStream },
  },
};

module.exports =
  eval(process.env.SOCIALHUB_ENVIRONMENT) == undefined
    ? devlopment
    : eval(process.env.SOCIALHUB_ENVIRONMENT);
// module.exports=devlopment

// SOCIALHUB_ASSET_PATH=/assets
// SOCIALHUB_DB= socialhub_production
// SOCIALHUB_JWT_SECRET=DXAcWN26vHAYjll92nzSqYTi8wo93a4Y
// SOCIALHUB_SESSION_COOKIE_KEY= RIaZDQKpFif69igvjBSYkBiwrVGkTldk
// SOCIALHUB_GMAIL_USERNAME=we.socialhubsite@gmail.com
// SOCIALHUB_GMAIL_PASSWORD=llky gnfy uulw dhtk
// SOCIALHUB_GOOGLE_CLIENT_ID=2727485938-ocq90ndbs7sc8mbfhdnqvr6eqtvrkfgl.apps.googleusercontent.com
// SOCIALHUB_GOOGLE_CLIENT_SECRET=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
// SOCIALHUB_GOOGLE_CALLBACK_URL=http://socialhub.com/users/auth/google/callback
