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
const {Detail,Email} = require('../models/detail');

router.post('/', upload.single('profile'), async (req, res)=> {

  // GETS LIST OF UNSUBSCRIBED LIST FROM DATABASE
    const unsubscribedDetails = await Email.find({}).select('name email -_id')
    // console.log('++++++++++++++++',unsubscribedDetails)
    var unsubscribed_emails = [];
    for(let i=0;i<unsubscribedDetails.length;i++){
        unsubscribed_emails.push(unsubscribedDetails[i].email);
    } 

    const userDetails = await Detail.find({}).select('name subject msg hours day -_id')
    console.log('.....ud',userDetails)
    let msg, subject, hours, day;
    for(let i=userDetails.length-1;i>=0;i--){
      msg = userDetails[i].msg
      subject = userDetails[i].subject
      hours = userDetails[i].hours
      day = userDetails[i].day
      break;
    }
    console.log('-------msg',msg,subject,hours,day)

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
                html: `<p>${msg} <a href="www.vandanapv.me"> Unsubscribe here</a></p>`
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

              // SCHEDULES THE TIME 
              cron.schedule(`* ${hours} * * ${day}`, () => {
                console.log(`Sends at ${hours} at ${date} on ${day}`);
                // SENDS EMAIL
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
    res.render('examples/success')
})

// EXPORTING ROUTER
module.exports = router;

