var express = require('express');
var router = express.Router();

var categories = ["benefits", "blog", "challenges", "community", "design", "education", "example", "opendesign", "source"];

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
  	title: req.query.title || '',
  	url: req.query.url || '',
  	twitter: req.query.twitter || '',
  	categories: categories 
  });
});

module.exports = router;
