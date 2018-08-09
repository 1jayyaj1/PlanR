var express = require('express');
var router = express.Router();
let User =  require('../models/user');

// Access the session as req.session
router.get('/', function(req, res, next) {
    console.log("HELLO");
    if (req.session.views) {
        req.session.views++
        res.setHeader('Content-Type', 'text/html')
        res.write('<p>views: ' + req.session.views + '</p>')
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
        res.write('<p>admin: ' + req.session.admin + '</p>')
        res.end()
    } else {
        req.session.views = 1;
        req.session.admin = true;
        res.end('welcome to the session demo. refresh!')
    }
});

router.post('/', function(req, res, next) {
    // todo: check first if already logged in or not,OR implement middleware for all pages


    // for now: assume not logged in
    try {
        const body = req.body;
        if (!body.username || !body.password) {
            return res.sendStatus(400);
        }
        User.find({ username: body.username })
            .exec()
            .then(users => {
                if (users.length == 0) {
                    return res.sendStatus(404);
                } else {
                    var user = users[0];
                    if (user.password === body.password) {
                        req.session.admin = user.admin;
                        return res.sendStatus(200);
                    } else {
                        return res.sendStatus(401);
                    }
                }
            })
            .catch(err => {
                console.log(err);
                return res.sendStatus(500);
            });
    } catch {
        return res.sendStatus(500);
    }
});

module.exports = router;
