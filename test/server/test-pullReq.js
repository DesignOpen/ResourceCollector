var mocha = require('mocha');
var expect = require('chai').expect;
var sinon = require('sinon');
var GitHubApi = require("github");
var pullReq = require('../../utils/pullReq');

/* Test requires that environment variables be available */
/* github_key='1f428193bc209e58fe53b16a003231034e84cf7c' & github_repo */
describe('Pull Req Util', function(){
  before(function(){
    var d = new Date();
    sub = {
      title: 'Testing '+d.toTimeString(),
      url: 'http://www.designopen.com',
      category: 'sources',
      twitter: '__christianmata',
      description: 'Something amazing! To test.'
    }
  });

  describe('pullReq.getContent Test', function(){
    it('should exist', function(){
      expect(pullReq.getContent).to.exist;
    });

    it('should return have all parts of submission', function(){
      var result = pullReq.getContent(sub);
      expect(result).to.contain(sub.title);
      expect(result).to.contain(sub.url);
      expect(result).to.contain(sub.category);
      expect(result).to.contain(sub.twitter);
      expect(result).to.contain(sub.description);
    });

    it('should return a properly formatted string', function(){
      var result = pullReq.getContent(sub);
      expect(result).to.equal('---\ntitle: "'+sub.title+'"\nlayout: resource\nsource_url: "http://www.designopen.com"\ncategory: "sources"\ncontributor: "__christianmata"\nposted_date: "'+ pullReq.getDate() +'"\n---\nSomething amazing! To test.');
    })
  });

  describe('pullReq.getSummary Test', function(){
    it('should exist', function(){
      expect(pullReq.getSummary).to.exist;
    });

    it('should have all parts of submission', function(){
      var result = pullReq.getSummary(sub);
      expect(result).to.contain(sub.url);
      expect(result).to.contain(sub.category);
      expect(result).to.contain(sub.twitter);
      expect(result).to.contain(sub.description);
    });

    it('should be have proper formatting', function(){
      var result = pullReq.getSummary(sub);
      expect(result).to.equal('**URL:** http://www.designopen.com\n**Category:** sources\n**Submitted by:** [@__christianmata](http://twitter.com/__christianmata)\n\n**Description:** \nSomething amazing! To test.')
    });
  });

  //async test
  describe('pullReq.makePullRequest', function(){
    it('should return a pull request', function(done){
      this.timeout(0);
      pullReq.makePullRequest(sub).then(function(pr){
        expect(pr).to.exist;
        expect(pr.title).to.equal('Add resource: '+sub.title);
        expect(pr.body).to.equal('**URL:** http://www.designopen.com\n**Category:** sources\n**Submitted by:** [@__christianmata](http://twitter.com/__christianmata)\n\n**Description:** \nSomething amazing! To test.');
        pullReq.closePullRequest(pr.title, pr.number, done);
      });
    });
  });
});
