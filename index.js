const express = require('express');
const path = require('path');
const fs = require('fs');
const { resourceLimits } = require('worker_threads');
const { data } = require('./data/data');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passport_local_mongoose = require('passport-local-mongoose');
const User = require('./src/models/user');
const Questions = require('./src/models/Questions');
var session = require('express-session');
var alert = require('alert');
require('./src/db/conn');



// to define and render template engines
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//serve static files such as images, CSS files, and JavaScript files, 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(session({ secret: 'SECRET' }));
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.use(require("express-session")({
    secret: "Miss white is my cat",
    resave: false,
    saveUninitialized: false
}));
// const {home} = require('./models/index');
// app.use('/',home);
app.get('/', (req, res) => {
    res.render("Home")
})
app.get('/pathavali', (req, res) => {
    res.render("pathavali")
})
app.get('/signup', (req, res) => {
    res.render('signup');
})
app.get('/login', (req, res) => {
    res.render('login');
})
app.post('/signup', (req, res, next) => {
    User.register(new User({
        username: req.body.username,
        email:req.body.email,
    }),
        req.body.password, (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    err: err
                });
            } else {
                passport.authenticate('local')(req, res, () => {
                    User.findOne({
                        username: req.body.username
                    }, (err, person) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({
                            success: true,
                            status: 'Registration Successful!',
                        });
                    });
                })
            }
        })
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/faqs",
    failureRedirect: "/login"
}), function (req, res) {
});

function read() {
    // const data = "";
    fs.readFileSync('./public/assets/Path/temp.txt', 'UTF-8', (err, data) => {
        if (err)
            console.log(err);
        else {
            console.log(data);
            return data;
        }
    })
}

app.get('/pathavali/nitya_niyam_path', (req, res) => {
    fs.readFile('./public/assets/Path/temp.txt', 'utf8', (error, data) => {
        console.log(data);
        res.render("Nitya_niyam_path", { data });
    });

})
app.get('/pathavali/8_sama_na_darshan', (req, res) => {
    res.render("8_sama_na_darshan");
})
app.get('/pathavali/introduction', (req, res) => {
    res.render("introduction");
})
app.get('/audio', (req, res) => {
    res.render("Audio")
})
app.get('/e-books', (req, res) => {
    res.render("ebooks");
})
app.get('/videos', (req, res) => {
    res.render("video");
})
app.get('/videos/bal_leela', (req, res) => {
    res.render("bal_leela");
})
app.get('/api/event-details', (req, res) => {
    res.send(data);
})
app.get('/events', (req, res) => {
    res.render("events", { data: data });
})
app.get('/faqs',isLoggedIn, function(req, res) {
   Questions.find((err,doc)=>{
    if(!err)
    {
        res.render('faqs',{data:doc});
    }
    else
    {
        console.log(err);
    }
   })
})
app.get('/ask_question',isLoggedIn, (req,res)=>{
    res.render('ask_question');
})
app.post('/ask_question',async (req,res)=>{
 try
 {
    const questionText = req.body.question;
    const NewQuestion = new Questions({
         username:req.user.username,
         questionText:questionText
    });
    const question = await NewQuestion.save();
    console.log(question);
    res.status("201").render('faqs');
 }
 catch(e)
 {
    res.status('401').send(e);
 }
})
app.get('/reply',isLoggedIn,(req,res)=>{
    res.render('reply');
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}