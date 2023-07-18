const nodemailer = require('nodemailer');
const express = require("express");

const sendEmail = express.Router();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vkservice24hr@gmail.com",
    pass: "qdlrkyzhliyjlkrx"
  }
});

sendEmail.post("/send/:name/:to/:title", async (req, res) => {
  const { name, to, title } = req.params;
  const mailOptions = {
    from: "vkservice24hr@gmail.com",
    to: to,
    subject: `Thanks for the booking: ${name}`,
    html: `Hi, Your Event Title is <strong><span style="color: green">${title}</span></strong><br><br>Thank you for booking our event! Your Event is Initiated, please wait for Your Final confirmation from <strong><span style="color: blue">Superuser</span></strong>.<br><br>Check Your Event Status in Dashboard!<br><br>See you soon!<br><br>Best regards,<br>The Event Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Email sent successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

sendEmail.post("/send/superuser/:name/:to/:title", async (req, res) => {
  const { name, to, title } = req.params;
  const mailOptions = {
    from: "vkservice24hr@gmail.com",
    to: to,
    subject: `New Event Booked By: ${name}`,
    html: `Hi <span style="color: blue"><strong>Superuser</strong>,</span><br><br>A new event has been booked with this Title <strong><span style="color: green">${title}</span></strong>. Please review and confirm the event as soon as possible.<br><br>Please take action for the user and update in Dashboard.<br><br>Best regards,<br>The Event Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Email sent successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

sendEmail.post("/send/deletion/:name/:to/:title", async (req, res) => {
  const { name, to, title } = req.params;
  const mailOptions = {
    from: "vkservice24hr@gmail.com",
    to: to,
    subject: `Event Canceled: ${title}`,
    html: `Hi, We inform you that the <strong><span style="color: red">${title}</span></strong> Event has been canceled.<br><br>Best regards,<br>The Event Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Deletion confirmation email sent successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

sendEmail.post("/send/deletionSuperUser/:name/:to/:title", async (req, res) => {
  const { name, to, title } = req.params;
  const mailOptions = {
    from: "vkservice24hr@gmail.com",
    to: to,
    subject: `Event Canceled by: ${name}`,
    html: `Hi, <span style="color: blue"><strong>Superuser</strong>,</span><br><br>The Event <strong><span style="color: red">${title}</span></strong> has been cancel by ${name}.<br><br>We apologize for any inconvenience caused.<br><br>Best regards,<br>The Event Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Deletion confirmation email sent successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});


//Event Accept Mail
sendEmail.post("/send/acceptmail/:name/:to/:title", async (req, res) => {
  console.log("working")
  const { name, to, title } = req.params;
  const mailOptions = {
    from: "vkservice24hr@gmail.com",
    to: to,
    subject: `Event Accept by:Superuser`,
    html: `Hi,  ${name}<br><br> The Event <strong><span style="color:green">${title}</span></strong> is Accepted by <span style="color: blue"><strong>Superuser</strong></span> <br><br>Best Wishesh for Your plan...!<br><br>Best regards,<br>The Event Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Event Accept confirmation email sent successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});


//Event Reject Mail 

sendEmail.post("/send/rejectmail/:name/:to/:title", async (req, res) => {
  console.log("working")
  const { name, to, title } = req.params;
  const mailOptions = {
    from: "vkservice24hr@gmail.com",
    to: to,
    subject: `Event Rejected by:Superuser`,
    html: `Hi,  ${name}<br><br>We regret to inform you that the <strong><span style="color:red">${title}</span></strong> Event has been Rejected by<span style="color: blue"><strong>Superuser</strong></span> <br><br>We sincerely apologize for any inconvenience caused.If you have any query call SUPERUSER<br><br>Best regards,<br>The Event Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send("Event Accept confirmation email sent successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});



module.exports = sendEmail;





