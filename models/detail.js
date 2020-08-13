const mongoose = require('mongoose')

// JOI FOR VALIDATION
const Joi = require('@hapi/joi');

// USED TO GET THE DETAILS TO SEND AN EMAIL 
const detailSchema = new mongoose.Schema({
    name:  String,
    subject:  String,
    msg:  String,
    hours: Number,
    // date: Number,
    day: String
})

// USED TO GET UNSUBSCRIBED MAIL LIST FROM USER
const emailSchema = new mongoose.Schema({
    email: String
})

const Detail = mongoose.model('DetailList', detailSchema);
const Email = mongoose.model('Email', emailSchema);

function validateDetail(details){
    const schema = Joi.object ({
        name: Joi.string(),
        subject: Joi.string(),
        msg: Joi.string(),
        hours: Joi.number(),
        date: Joi.number(),
        day: Joi.string(),
    })

    return schema.validate(details)
}

exports.Detail = Detail;
exports.Email = Email;
exports.validate = validateDetail;

