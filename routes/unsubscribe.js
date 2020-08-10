const express = require('express');
const router = express.Router();
const {Email} = require('../models/detail');

router.get('/',(req,res) => {
    // RENDER THE PAGE WHERE USER SEND THEIR EMAIL
    res.render('unsubscribe') 
    })

router.post("/",async (req,res) =>{
    // SAVES UNSUBSCRIBED EMAILS IN DATABASE
    let  emaildetails = new Email({ 
        email: req.body.email
    })
    emaildetails = await emaildetails.save()
    console.log('---details---', emaildetails)
    res.send(emaildetails);
})

// EXPORTING THE ROUTE 
module.exports = router;