var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
  	title: req.query.title || '',
  	url: req.query.url || '',
  	twitter: req.query.twitter || ''
  });
});

/* GET bookmarklet JS. */
router.get('/bookmarklet.js', function(req, res) {
	res.render('bookmarklet-js', {
		host: req.headers.host
	});
});

module.exports = router;
