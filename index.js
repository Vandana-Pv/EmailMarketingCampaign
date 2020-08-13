const express = require('express');
const mongoose = require('mongoose')
var fileupload = require('express-fileupload')

// IMPORTING ROUTES
const unsubscribe = require('./routes/unsubscribe')
const emailCampaign = require('./routes/fileUpload');
const sample = require('./routes/sample')

const app = express();

// SETTING VIEW ENGINE AS EJS
app.set("view engine", "ejs");

// STATIC FOLDER
app.use(express.static('./views/assets'));

app.use(express.json())
app.use(fileupload())
app.use(express.urlencoded({extended : true}));

// CONNECTS TO DATABASE
mongoose.connect('mongodb://localhost/campaign')
        .then(() => console.log('Connected to MongoDB...'))
        .catch(err => console.error('Could not connect to MongoDB', err))

// USING ROUTES
app.use('/unsubscribe',unsubscribe)
app.use('/emailCampaign',emailCampaign)
app.use('/dashboard',sample)

// PORT STARTED
const port = process.env.PORT || 4000;
app.listen(port, function () {
    console.log("Express app started on port 4000");
});