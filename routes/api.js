var express = require('express');
var router = express.Router();
var github = require('octonode');
var validator = require('validator');
var env = require('../config/env');

/* Process new resource form */
router.post('/resource', function(req, res) {
  var title = req.body.title;
  var url = req.body.URL;
  var twitter = req.body.twitter.replace(/@/g, '');
  var description = req.body.description;
  var category = req.body.category;

  if (validator.isNull(title)) {
  	res.json({
  		success: false,
  		error: 'Please enter a title.'
  	});
  	return;
  }

  if (!validator.isURL(url, {require_protocol: true})) {
  	res.json({
  		success: false,
  		error: 'Please enter a valid URL.'
  	});
  	return;
  }

  if (validator.isNull(twitter)) {
  	res.json({
  		success: false,
  		error: 'Please enter your Twitter handle.'
  	});
  	return;
  }

  if (validator.isNull(description)) {
  	res.json({
  		success: false,
  		error: 'Please enter a description.'
  	});
  	return;
  }

  if (validator.isNull(category)) {
  	res.json({
  		success: false,
  		error: 'Please choose a category.'
  	});
  	return;
  }

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
	  	res.json({
	  		success: false,
	  		error: 'Unable to process your entry, please try again later.'
	  	});
  	}
  	res.json({
  		success: true,
  		url: response.url,
  		issue: response.number
  	});
  });
});

module.exports = router;
