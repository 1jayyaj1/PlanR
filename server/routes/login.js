var express = require('express');
var router = express.Router();
let User =  require('../models/user');

// Access the session as req.session
router.get('/', function(req, res, next) {
    console.log("HELLO");
    req.session.logged = true;
    req.session.admin = true;
    req.session.username = "Jerry";
    // res.end('welcome to the session demo. refresh!')
    res.sendStatus(200);
});

router.post('/', function(req, res, next) {
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
                        req.session.logged = true;
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
