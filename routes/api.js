var express = require('express');
var router = express.Router();
var Q = require("q");
var shortId = require('shortid');
var GitHubApi = require("github");
var validator = require('validator');
var env = require('../config/env');
var https = require('https');

var makePullRequest = function(submission) {
  var github = new GitHubApi({
      version: "3.0.0"
  });

  github.authenticate({
      type: "token",
      token: env.github_key
  });

  function newPullRequest(msg) {
    var getHeadReference = Q.nfcall(github.gitdata.getReference, {
      user: msg.user,
      repo: msg.repo,
      ref: 'heads/' + msg.ref
    });
    var createNewBlob = Q.nfcall(github.gitdata.createBlob, {
      user: msg.user,
      repo: msg.repo,
      content: msg.content,
      encoding: 'utf-8'
    });
    var createNewTree = Q.spread([getHeadReference, createNewBlob], function(headReference, newBlob) {
      return Q.nfcall(github.gitdata.createTree, {
        user: msg.user,
        repo: msg.repo,
        base_tree: headReference.object.sha,
        tree: [{
          path: msg.path,
          mode: '100644',
          type: 'blob',
          sha: newBlob.sha
        }]
      });
    });
    var createNewCommit = Q.spread([getHeadReference, createNewTree], function(headReference, newTree) {
      return Q.nfcall(github.gitdata.createCommit, {
        user: msg.user,
        repo: msg.repo,
        message: msg.message,
        tree: newTree.sha,
        parents: [headReference.object.sha]
      });
    });
    var createNewReference = createNewCommit.then(function(newCommit) {
      return Q.nfcall(github.gitdata.createReference, {
        user: msg.user,
        repo: msg.repo,
        ref: 'refs/heads/' + msg.branch,
        sha: newCommit.sha
      });
    });
    var createNewPullRequest = createNewReference.then(function(newReference) {
      return Q.nfcall(github.pullRequests.create, {
        user: msg.user,
        repo: msg.repo,
        title: msg.message,
        body: msg.pullRequestBody,
        base: 'refs/heads/' + msg.ref,
        head: newReference.ref
      });
    });
    var addLabel = createNewPullRequest.then(function(newPullRequest) {
      return Q.nfcall(github.issues.edit, {
        user: msg.user,
        repo: msg.repo,
        number: newPullRequest.number,
        labels: msg.labels
      });
    });
    return Q.spread([createNewPullRequest, createNewPullRequest], function(newPullRequest, label) {
      return newPullRequest;
    });
  }

  function getDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if(month < 10) month = '0' + month;
    if(day < 10) month = '0' + day;
    return year + '-' + month + '-' + day;
  }

  function getSlug(str) {
    return str.toLowerCase()
              .replace(/ /g,'-')
              .replace(/[^\w-]+/g,'');
  }

  function getContent(submission) {
    var content = [];
    content.push('---');
    content.push('title: "' + submission.title + '"');
    content.push('layout: resource');
    content.push('source_url: "' + submission.url + '"');
    content.push('category: "' + submission.category + '"');
    content.push('contributor: "' + submission.twitter + '"');
    content.push('posted_date: "' + getDate() + '"');
    content.push('---');
    content.push(submission.description);
    return content.join("\n");
  }

  function getSummary(submission) {
      var content =  [];
      content.push('**URL:** ' + submission.url);
      content.push('**Category:** ' + submission.category);
      content.push('**Submitted by:** [@' + submission.twitter + '](http://twitter.com/' + submission.twitter + ')');
      content.push('');
      content.push('**Description:** ');
      content.push(submission.description);
      return content.join("\n");
  }

  function process(submission) {
    var msg = {};
    msg.user = env.github_repo.split('/')[0];
    msg.repo = env.github_repo.split('/')[1];
    msg.ref = 'master';
    msg.branch = 'resource-' + submission.twitter + '-' + shortId.generate().toLowerCase();
    msg.path = 'resources/_posts/' + getDate() + '-' + getSlug(submission.title) + '.md';
    msg.content = getContent(submission);
    msg.message = 'Add resource: ' + submission.title;
    msg.labels = ['resource'];
    msg.pullRequestBody = getSummary(submission);
    return newPullRequest(msg);
  }

  return process(submission);
};

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
      makePullRequest(submission).then(function(pr) {
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
