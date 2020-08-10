const express = require('express');
const router = express.Router();
const dotenv = require('dotenv/config');
var cron = require('node-cron');

// FOR CONVERTING CSV TO JSON
const CSVToJSON = require('csvtojson');

// FOR SENDING EMAIL
var nodemailer = require('nodemailer'); 

// FOR FILE UPLOADING
var multer  = require('multer') 
var upload = multer({ dest: 'uploads/' })

// IMPORTING MODELS
const {Detail,Email,validate} = require('../models/detail');

router.get('/',(req,res) => {
res.render('form') // RENDER THE FORM PAGE WHERE USER SENDS THE DATA
})

router.post('/', upload.single('profile'), async (req, res)=> {

  // GETS LIST OF UNSUBSCRIBED LIST FROM DATABASE
    const unsubscribedDetails = await Email.find({}).select('name email -_id')
    // console.log('++++++++++++++++',unsubscribedDetails)
    var unsubscribed_emails = [];
    for(let i=0;i<unsubscribedDetails.length;i++){
        unsubscribed_emails.push(unsubscribedDetails[i].email);
    }

    // SAVES THE USER DETAILS GIVEN IN FORM : NAME, DAY, HOURS, SUBJECT, MESSAGE
    const {error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let  details = new Detail({ 
        name: req.body.name,
        subject: req.body.subject,
        msg: req.body.msg,
        hours: req.body.hours,
        date: req.body.date,
        day: req.body.day
    })
    details = await details.save()
    console.log('---details---', details)

    // GETS THE UPLOADED CSV FILE FROM USER
    const file = req.files;
    console.log(req.files);
    console.log(req.files.profile.name) // DISPLAYS THE NAME OF THE FILENAME

    // CONVERT CSV FILE TO JSON ARRAY
    CSVToJSON().fromFile(`${req.files.profile.name}`)
    .then(emails => {
        // console.log('Total details Email Campaign List',emails);
        // console.log('Total number of people in Email Campaign List',emails.length);
        var emailsArray = [];
        for(let i=0;i<emails.length;i++){
            emailsArray.push(emails[i].email);
        }
        console.log('Email campaign list',emailsArray);

        // FINDS UNSUBSCRIBED EMAILS AND REMOVES THE EMAILS FROM THE LIST
        emailsArray = emailsArray.filter(function(item) {
        return !unsubscribed_emails.includes(item); 
        })

        console.log('Unsubscribed emails List:',unsubscribed_emails); 
        var finalEmails = emailsArray.join(", "); 
        console.log('Final Emails Sending List:',finalEmails)

        // USING NODEMAILER FOR SENDING EMAILS 
        var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: process.env.EMAIL,
                  pass: process.env.PASS
                }
              });
              
              var mailOptions = {
                from: process.env.EMAIL,
                to: finalEmails,
                subject: `${subject}`,
                html: `<p>${message}</p>`
              };

              // SAMPLE CRON SCHEDULERS 

              // cron.schedule('* * * * Saturday', () => {
              //   console.log('Sends at Monday and Saturday');
              // });

              // cron.schedule('* 10 * * *', () => {
              //   console.log('Sends at 10 AM');
              // });

              // cron.schedule('* * 15 Jan *', () => {
              //   console.log('Sends at 15th Jan');
              // });

              // cron.schedule('* 10 * * Monday,Saturday', () => {
              //   console.log('Sends at 10 AM at Monday and Saturday');
              // });

              cron.schedule(`* ${hours} ${date} * ${day}`, () => {
                console.log(`Sends at ${hours} at ${date} on ${day}`);
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });
              });

        
    }).catch(err => {
        // log error if any
        console.log(err);
    });

    // RENDERS THE SUCCESSFUL EMAIL SENT PAGE
    res.render('success',{
      data: req.body,
      errors: {
        message: {
          msg: 'A message is required'
        },
        email: {
          msg: 'That email doesn‘t look right'
        }
      }
    })
})

// EXPORTING ROUTER
module.exports = router;

