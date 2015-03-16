var express = require('express');
var router = express.Router();
var validator = require('validator');
var https = require('https');
var pullReq = require('../utils/pullReq');

/* Process new resource form */
router.post('/resource', function(req, res) {
  var title = req.body.title || '';
  var url = req.body.URL || '';
  var twitter = req.body.twitter || '';
  var description = req.body.description || '';
  var category = req.body.category || '';

  title = title.trim();
  url = url.trim();
  twitter = twitter.replace(/@/g, '').trim();
  description = description.trim();
  category = category.trim().toLowerCase();

  if (validator.isNull(title)) {
  	res.status(400).json({
  		success: false,
  		error: 'Please enter a title.'
  	});
  	return;
  }

  if (!validator.isURL(url, {require_protocol: true})) {
  	res.status(400).json({
  		success: false,
  		error: 'Please enter a valid URL.'
  	});
  	return;
  }

  if (validator.isNull(twitter)) {
  	res.status(400).json({
  		success: false,
  		error: 'Please enter your Twitter handle.'
  	});
  	return;
  }

  if (validator.isNull(description)) {
  	res.status(400).json({
  		success: false,
  		error: 'Please enter a description.'
  	});
  	return;
  }

  if (validator.isNull(category)) {
  	res.status(400).json({
  		success: false,
  		error: 'Please choose a category.'
  	});
  	return;
  }

  https.get({method: 'HEAD', host: 'twitter.com', port: 443, path: '/' + twitter}, function(r) {
    if(r.statusCode != 200) {
      res.status(400).json({
        success: false,
        error: 'Please enter a valid Twitter handle.'
      });
      return;
    } else {
      var submission = {
        title: title,
        url: url,
        category: category,
        twitter: twitter,
        description: description
      }
      pullReq.makePullRequest(submission).then(function(pr) {
          res.json({
            success: true,
            url: pr.html_url,
            issue: pr.number
          });
      }, function(err) {
          res.status(500).json({
            success: false,
            error: 'Unable to process your entry, please try again later.'
          });
      });
    }
  });

});

module.exports = router;
