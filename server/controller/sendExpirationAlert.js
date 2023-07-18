const nodemailer = require('nodemailer');
const express = require("express");
const sendExpirationAlert = express.Router();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vkservice24hr@gmail.com',
        pass: 'qdlrkyzhliyjlkrx'
    }
});


sendExpirationAlert.post("/sendExpired/:name/:to/",async(req, res)=>{
    const {name,to}=req.params
        const mailOptions = {
            from:"vkservice24hr@gmail.com",
            to:to,
            subject: `Thanks For your Booking.! ${name}`,
            text: `Hi ${name},\n\nYour event has expired. We hope you had a great time!\n\nBest regards,\nThe Event Team`
        
        
        }

        transporter.sendMail(mailOptions,async(err, info) => {
            if(err) {
                res.send(err.message)
            }
            else{
                res.send("Email sent successfully")
            }
        })
});

  module.exports = sendExpirationAlert;



