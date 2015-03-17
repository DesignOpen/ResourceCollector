var express = require('express');
var router = express.Router();
var pullReq = require('../utils/pullReq');
var validate = require('../utils/validate');

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

  var submission = {
    title: title,
    url: url,
    category: category,
    twitter: twitter,
    description: description
  }

  validate.validateFields(submission, function(err){
    res.status(400).json(err);
    return;
  }, function(){
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
  });
});

module.exports = router;
