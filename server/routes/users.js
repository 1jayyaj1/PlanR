var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var test = {
    name: "John",
    email: "Doe@mail.com"
  }
  res.json(test);
});

router.get('/hello', function(req, res, next) {
  var test = {
    name: "John 2",
    email: "Doe@mail.com"
  }
  res.json(test);
});

module.exports = router;
