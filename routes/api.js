var express = require('express');
var router = express.Router();
var github = require('octonode');
var validator = require('validator');
var env = require('../config/env');
var https = require('https');

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
  category = category.trim();

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
      var body = "URL: " + url + "\n";
      body = body + "Category: " + category + "\n";
      body = body + "Description: " + description + "\n\n";
      body = body + "Submitted by: http://twitter.com/" + twitter + "\n";

      var client = github.client(env.github_key);
      var ghrepo = client.repo(env.github_repo);

      ghrepo.issue({
        "title": "Add Resource: " + title,
        "body": body,
        "labels": ["resource"]
      }, function(err, response) {
        if (err) {
          res.status(500).json({
            success: false,
            error: 'Unable to process your entry, please try again later.'
          });
        }
        else{
          res.json({
            success: true,
            url: response.html_url,
            issue: response.number
          });
        }
      });
    }
  });

});

module.exports = router;
