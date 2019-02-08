var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.post('/', function(req, res, next) {
    const body = req.body;
    try {
        var fullName = body.notifyFullName;
        var sender = body.notifyEmailSender;
        var emails = body.notifyEmailRecepients;
        var message = body.notifyMessage;
        var eventName = body.notifyEventName;
        var eventStart = body.notifyEventStart;
        console.log(emails);
        nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                secure: false,
                auth: {
                    user: 'umbawellness@gmail.com',
                    pass: 'jaja2637'
                },
                tls: {
                    rejectUnauthorized: false
                }
                });
        
            emails.forEach(email => {
                // setup email data with unicode symbols
                console.log(email);
                var firstName = email.substr(0,email.indexOf('.'));
                let mailOptions = {
                    from: '"Umba" <umbawellness@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: 'Message from ' + fullName + " " + "regarding your upcoming " + eventName + " event" + " on " + eventStart, // Subject line
                    text: "Hello" + " " + firstName + "," + "\n\n" + fullName + " (" + sender + ")," + "instructor of your upcoming " + eventName + " event" + " says: " + message + "\n\n" + "Replies to the following message must only be sent directly to the instructor's email." + "\n\n" + "Best, " + "\n\n" + "Umba team", // plain text body
                };
                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            
                });
            });

        });
        return res.sendStatus(200);
       
    } catch {
        return res.sendStatus(400);
    }
});


module.exports = router;
