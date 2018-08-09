var express = require('express');
var router = express.Router();
let User =  require('../models/user');

const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

router.get('/:userId', function(req, res, next) {
  try {
    User.find({"_id" : req.params.userId})
        .exec()
        .then(users => {
            if (users.length == 0) {
                return res.sendStatus(404);
            } else {
                return res.send(users[0])
            }
        })
        .catch(err => {
            console.log(err);
            return res.sendStatus(404);
        })
  } catch {
        return res.sendStatus(404);
  }
});

router.put('/:userId', function(req, res, next) {
    const body = req.body;
    const id = req.params.userId;
    var updateFields = {};
    try {
        if (body.name) {
            if (/^[a-zA-Z ]+$/.test(body.name)) {
                updateFields.name = body.name;
            } else {
                return res.sendStatus(400);
            }
        } 
        if (body.email) {
            if (emailRegex.test(body.email)) {
                updateFields.email = body.email;
            } else {
                return res.sendStatus(400);
            }
        } 
        if (body.admin) {
            updateFields.admin = Boolean(body.admin);
        }
        if (body.username) {
            updateFields.username = body.username;
        }
        if (body.password) {
            updateFields.password = body.password;
        }
        User.findByIdAndUpdate(id, updateFields, {new: true})
        .then(user => {
            if (!user) {
                return res.status(404).send("User not found with id " + id);
            }
            return res.send(user);
        })
        .catch(err => {
            console.log(err);
            if (err.code === 11000) {
                return res.status(404).send("User not found with id " + id);
            }
            return res.sendStatus(500);
        })
    } catch {
        return res.sendStatus(500);
    }
});

router.post('/', function(req, res, next) {
    const body = req.body;
    try {
        if (/^[a-zA-Z ]+$/.test(body.name) && emailRegex.test(body.email)) {
            var user = new User({
                name: body.name,
                email: body.email,
                admin: body.admin,
                username: body.username,
                password: body.password
            });

            user.save()
            .then(doc => {
                console.log('Created user ' + doc._id);
                return res.sendStatus(200)
            })
            .catch(err => {
                console.error(err);
                if (err.code === 11000) {
                    return res.status(500).send("This user already exists in the database");
                }
                return res.status(500).send("Unable to create user in database")
            })
        } else {
            return res.sendStatus(400)
        }
    } catch {
        return res.sendStatus(400)
    }
});

router.delete('/:userId', function(req, res, next) {
    const id = req.params.userId;
    User.findByIdAndRemove(id)
    .then(user => {
        if (!user) {
            return res.status(404).send("User not found with id " + id);
        }
        return res.sendStatus(200)
    }).catch(err => {
        if (err.code === 11000) {
            return res.status(404).send("User not found with id " + id);                
        }
        return res.status(500).send("Unable to delete user " + id)
    });
})

module.exports = router;
