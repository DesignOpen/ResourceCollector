var env = require('../config/env');
var shortId = require('shortid');
var GitHubApi = require("github");
var Q = require("q");

var getDate = function() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if(month < 10) month = '0' + month;
  if(day < 10) month = '0' + day;
  return year + '-' + month + '-' + day;
}

var getSlug = function(str) {
  return str.toLowerCase()
            .replace(/ /g,'-')
            .replace(/[^\w-]+/g,'');
}

var getContent = function(submission) {
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

var getSummary = function(submission) {
    var content =  [];
    content.push('**URL:** ' + submission.url);
    content.push('**Category:** ' + submission.category);
    content.push('**Submitted by:** [@' + submission.twitter + '](http://twitter.com/' + submission.twitter + ')');
    content.push('');
    content.push('**Description:** ');
    content.push(submission.description);
    return content.join("\n");
}

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

module.exports = {
  makePullRequest: makePullRequest,
  getContent: getContent,
  getSummary: getSummary,
  getDate: getDate
};
