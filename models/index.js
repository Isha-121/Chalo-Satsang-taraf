const express = require('express');
const router = express.Router();

const Home = router.get('/',(req,res)=>{
    return res.render('Home');
});


module.export = {Home};