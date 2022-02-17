const express = require('express');
const path = require('path');
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
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});