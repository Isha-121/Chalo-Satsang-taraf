const express = require("express");
const path = require("path");
const fs = require("fs");
const { resourceLimits } = require("worker_threads");
const { data } = require("./data/data");
const { paths } = require("./data/paths");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const port = process.env.PORT || 3001;
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passport_local_mongoose = require("passport-local-mongoose");
const User = require("./src/models/user");
const Questions = require("./src/models/Questions");
var session = require("express-session");
var flash = require("connect-flash");
var alert = require("alert");
require("./src/db/conn");

// to define and render template engines
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//serve static files such as images, CSS files, and JavaScript files,
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(session({ secret: "SECRET" }));
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use(
  require("express-session")({
    secret: "Shrinathji",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 86400000 },
  })
);
app.use(flash());

app.get("/", (req, res) => {
  res.render("Home");
});
app.get("/pathavali", (req, res) => {
  res.render("pathavali");
});
app.get("/signup", (req, res) => {
  //console.log(req.body);
  res.render("signup");
  console.log(req.body);
});
app.get("/login", (req, res) => {
  // console.log(req.session.messages);
  res.render("login.ejs", { message: req.session.messages });
  // console.log(req.body);
});
app.post("/signup", (req, res, next) => {
  User.register(
    new User({
      username: req.body.username,
      email: req.body.email,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({
          success:false,
          status:"invalid"
        });
      } else {
        passport.authenticate("local")(req, res, () => {
          User.findOne(
            {
              username: req.body.username,
            },
            (err, person) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json({
                success: true,
              });
              res.redirect('/');
            }
          );
        });
      }
    }
  );
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/faqs",
    failureRedirect: "/login",
    failureMessage: "Invalid Login Credentials",
  })
);
app.get("/pathavali/nitya_niyam_path", (req, res) => {
  res.render("Nitya_niyam_path", { data: paths });
});
app.get("/pathavali/bhajan",(req,res)=>{
  res.render("bhajan", {data:paths});
});
app.get("/pathavali/kirtan", (req, res) => {
  res.render("kirtan", { data: paths });
});
app.get("/pathavali/8_sama_na_darshan", (req, res) => {
  res.render("8_sama_na_darshan");
});
app.get("/pathavali/introduction", (req, res) => {
  res.render("introduction");
});
app.get("/e-books", (req, res) => {
  res.render("ebooks");
});
app.get("/videos", (req, res) => {
  res.render("video");
});
app.get("/videos/bal_leela", (req, res) => {
  res.render("bal_leela");
});
app.get("/api/event-details", (req, res) => {
  res.send(data);
});
app.get("/events", (req, res) => {
  res.render("events", { data: data });
});
app.get("/faqs", isLoggedIn, function (req, res) {
  Questions.find((err, doc) => {
    // console.log(doc);
    if (!err) {
      res.render("faqs", { data: doc });
    } else {
      console.log(err);
    }
  });
});
var id;
app.post("/faqs", (req, res) => {
  id = req.body.id;
});
app.post("/ask_question", async (req, res) => {
  //console.log(req.body);
  try {
    const questionText = req.body.question;
    const NewQuestion = new Questions({
      username: req.user.username,
      questionText: questionText,
    });
    const question = await NewQuestion.save();
    res.status("201").redirect("faqs");
  } catch (e) {
    res.status("401").send(e);
  }
});
app.post("/post_reply", (req, res) => {
  try {
    const reply = {
      username: req.user.username,
      replyText: req.body.reply,
    };
    console.log(reply);
    console.log("This is id: ", id);
    Questions.findOneAndUpdate(
      { _id: id },
      { $push: { replies: reply } },
      (err, docs) => {
        if (err) console.log(err);
        else console.log(docs);
      }
    );
    res.status("201").redirect("faqs");
  } catch (e) {
    res.status("401").send(e);
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
app.get("*", (req, res) => {
  return res.render("error");
});
