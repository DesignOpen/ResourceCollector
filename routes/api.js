var express = require('express');
var router = express.Router();
var github = require('octonode');
var env = require('../config/env');

/* Process new resource form */
router.post('/resource', function(req, res) {
  var title = req.body.title;
  var url = req.body.URL;
  var twitter = req.body.twitter;
  var description = req.body.description;
  var category = req.body.category;

  // STUB: Validate fields

  var body = "URL: " + url + "\n";
  body = body + "Category: " + category + "\n";
  body = body + "Description: " + description + "\n\n";
  body = body + "Submitted by: http://twitter.com/" + twitter.replace(/@/g, '') + "\n";

  var client = github.client(env.github_key);
  var ghrepo = client.repo(env.github_repo);

  ghrepo.issue({
    "title": "Add Resource: " + title,
    "body": body,
    "labels": ["resource"]
  }, function(err, res) {
    console.log(err, res);
  });

  // STUB: Send proper JSON response

  res.send('success');
});

module.exports = router;
