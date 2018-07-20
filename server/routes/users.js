var express = require('express');
var router = express.Router();
let User =  require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find()
      .sort()
      .exec()
      .then(docs => {
        console.log(docs)
        res.send(docs)
      })
});

module.exports = router;
