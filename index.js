const express = require('express');
const path = require('path');
const fs = require('fs');
const { resourceLimits } = require('worker_threads');
const {data} = require('./data/data');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passport_local_mongoose = require('passport-local-mongoose');
const Register = require('./src/models/user')
require('./src/db/conn');



// to define and render template engines
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//serve static files such as images, CSS files, and JavaScript files, 
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// const {home} = require('./models/index');
// app.use('/',home);
app.get('/',(req,res)=>{
     res.render("Home")
})
app.get('/pathavali',(req,res)=>{
    res.render("pathavali")
})
app.post("/signup", async(req, res) => {
    try {
        const password = req.body.password;
        const confirm = req.body.confirm;
        const username = req.body.username;
        const email = req.body.email;
        const gender = req.body.gender;
        //console.log(req.body);
       // console.log("hi");
        const hashed_password = await bcrypt.hash(password, 10);
        if (password === confirm) {
            const registerUser = new Register({
                email: email,
                username: username,
                password: hashed_password,
                confirm: confirm,
                gender:gender
            });

            //password hash
            //Concept of middleware

            const registered = await registerUser.save();
            res.status(201).render("home");


        } else {
            res.send("Passwords are not same");
        }

    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }

})
// app.get('/login',(req,res)=>{
//     res.render('/login');
// })


function read()
{
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

app.get('/pathavali/nitya_niyam_path',(req,res)=>{
    fs.readFile('./public/assets/Path/temp.txt','utf8',(error,data)=>{
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
app.get('/e-books',(req,res)=>{
    res.render("ebooks");
})
app.get('/videos',(req,res)=>{
    res.render("video");
})
app.get('/videos/bal_leela',(req,res)=>{
    res.render("bal_leela");
})
app.get('/api/event-details', (req, res) => {
    res.send(data);
})
app.get('/events',(req,res)=>{
    res.render("events",{data:data});
})
app.get('/faqs',(req,res)=>{
    res.render("faqs");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});