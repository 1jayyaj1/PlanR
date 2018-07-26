var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html')
    res.write('<h1>Hello you</h1>')
    res.end()
});

module.exports = router;
