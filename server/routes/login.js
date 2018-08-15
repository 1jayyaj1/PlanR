var express = require('express');
var router = express.Router();
let User =  require('../models/user');
var bcrypt = require('bcrypt');

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
                    bcrypt.compare(body.password, user.password, function(err, status) {
                        if (status == true) {
                            req.session.admin = user.admin;
                            req.session.username = user.name;
                            req.session.logged = true;
                            return res.sendStatus(200);
                        } else {
                            return res.sendStatus(401);
                        }
                    });
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
