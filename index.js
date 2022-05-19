const express = require('express');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 3001;
const app = express();



// to define and render template engines
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//serve static files such as images, CSS files, and JavaScript files, 
app.use(express.static("public"));



// const {home} = require('./models/index');
// app.use('/',home);
app.get('/',(req,res)=>{
     res.render("Home")
})
app.get('/pathavali',(req,res)=>{
    res.render("pathavali")
})

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});