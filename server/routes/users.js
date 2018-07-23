var express = require('express');
var router = express.Router();
let User =  require('../models/user');

router.get('/', function(req, res, next) {
  User.find()
      .sort()
      .exec()
      .then(docs => {
        res.send(docs)
      })
});

router.get('/:userId', function(req, res, next) {
  try {
    User.find({"_id" : req.params.userId})
        .exec()
        .then(users => {
          if (users.length == 0) {
            res.sendStatus(404);
          } else {
            res.send(users)
          }
        })
        .catch(docs => {
          res.sendStatus(404);
        })
  } catch {
    res.sendStatus(404);
  }
});

router.post('/', function(req, res, next) {
  const body = req.body;
  const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  try {
    if (/^[a-zA-Z ]+$/.test(body.name) && emailRegex.test(body.email)) {
      var user = new User({
        name: body.name,
        email: body.email,
        admin: body.admin
      });

      user.save()
      .then(doc => {
        console.log('Created user ' + doc._id);
        res.sendStatus(200)
      })
      .catch(err => {
        console.error(err);
        if (err.code === 11000) {
          res.status(500).send("This user already exists in the database")
        } else {
          res.status(500).send("Unable to create user in database")
        }
      })
    } else {
      res.status(400).send("Invalid JSON object or invalid field values")
    }
  } catch {
    res.sendStatus(400)
  }
});

module.exports = router;
