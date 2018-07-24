var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

var textBody = 'Hello World'
// Only needed if you don't have a real mail account for testing
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
          user: 'umba.testing@gmail.com',
          pass: 'Ericsson123'
        },
        tls: {
            rejectUnauthorized: false
        }
      });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Umba" <umba.testing@gmail.com>', // sender address
        to: 'umba.testing@gmail.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: textBody, // plain text body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
});
module.exports = router;
