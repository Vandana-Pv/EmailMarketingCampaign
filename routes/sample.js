const express = require('express');
const router = express.Router();

const {Detail,Email,validate} = require('../models/detail');

// FOR FILE UPLOADING
var multer  = require('multer') 
var upload = multer({ dest: 'uploads/' })

router.get('/',(req,res)=>{
    res.render('examples/dashboard')
})

router.post('/', async (req, res)=> {  
    let  final = new Detail({ 
        name: req.body.name,
        subject: req.body.subject,
        msg: req.body.msg,
        hours: req.body.hours,
        // date: req.body.date,
        day: req.body.day
    })
    final = await final.save()
    console.log('---hello---', final)
    res.render('examples/upload')
})

module.exports = router;

