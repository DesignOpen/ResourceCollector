var mocha = require('mocha');
var expect = require('chai').expect;
var request = require('supertest');
var pullReq = require('../../utils/pullReq');
var app = require('../../app');

describe("API Test", function() {
  before(function(){
    var d = new Date();
    sub = {
      title:'API Test: '+d.toString(),
      URL:'http://designopen.com',
      twitter:'@__christianmata',
      category: 'sources',
      description:'A description'
    }
  });

  describe('GET /', function(){
    this.timeout(0);
    it('should return a HTML page', function(done){
      request(app)
        .get('/')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, done);
    });
  });

  describe('GET /javascripts/bookmarklet.js', function(){
    this.timeout(0);
    it('should return bookmarklet JS', function(done){
      request(app)
        .get('/javascripts/bookmarklet.js')
        .expect('Content-Type', 'application/javascript')
        .expect(200, done);
    });
  });

  describe('GET /javascripts/form.js', function(){
    this.timeout(0);
    it('should return a form JS', function(done){
      request(app)
        .get('/javascripts/form.js')
        .expect('Content-Type', 'application/javascript')
        .expect(200, done);
    });
  });

  describe("POST /api/resource", function() {
    this.timeout(0);
    it('should reject empty POST', function(done){
      request(app)
        .post('/api/resource')
        .send({})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res){
          if(!(res.body.success === false)){return 'Incorrect success boolean: '+res.body.success}
          if(!(res.body.error === 'Please enter a title.')){ return 'Incorrect error text: "'+res.body.error+'"';}
        })
        .expect(400, done);
    });
    it('should reject POST without valid URL', function(done){
      request(app)
        .post('/api/resource')
        .send({title:'API Test'})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res){
          if(!(res.body.success === false)){return 'Incorrect success boolean: '+res.body.success}
          if(!(res.body.error === 'Please enter a valid URL.')){ return 'Incorrect error text: "'+res.body.error+'"';}
        })
        .expect(400, done);
    });
    it('should reject POST without a twitter handle', function(done){
      request(app)
        .post('/api/resource')
        .send({title:'API Test', URL:'http://designopen.com'})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res){
          if(!(res.body.success === false)){return 'Incorrect success boolean: '+res.body.success}
          if(!(res.body.error === 'Please enter your Twitter handle.')){ return 'Incorrect error text: "'+res.body.error+'"';}
        })
        .expect(400, done);
    });
    it('should reject POST without a description', function(done){
      request(app)
        .post('/api/resource')
        .send({title:'API Test', URL:'http://designopen.com', twitter:'@__christianmata'})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res){
          if(!(res.body.success === false)){return 'Incorrect success boolean: '+res.body.success}
          if(!(res.body.error === 'Please enter a description.')){ return 'Incorrect error text: "'+res.body.error+'"';}
        })
        .expect(400, done);
    });
    it('should reject POST without a category', function(done){
      request(app)
        .post('/api/resource')
        .send({title:'API Test', URL:'http://designopen.com', twitter:'@__christianmata', description:'A description'})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res){
          if(!(res.body.success === false)){return 'Incorrect success boolean: '+res.body.success}
          if(!(res.body.error === 'Please choose a category.')){ return 'Incorrect error text: "'+res.body.error+'"';}
        })
        .expect(400, done);
    });
    //this test depends on the twitter handle that's inputted to not be true otherwise it will go thru successfully.
    //Currently, @OSDRC_testing doesn't exist.
    it('should reject POST without valid Twitter account', function(done){
      request(app)
        .post('/api/resource')
        .send({title:'API Test', URL:'http://designopen.com', twitter:'@OSDRC_testing', category: 'sources', description:'A description'})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res){
          if(!(res.body.success === false)){return 'Incorrect success boolean: '+res.body.success}
          if(!(res.body.error === 'Please enter a valid Twitter handle.')){ return 'Incorrect error text: "'+res.body.error+'"';}
        })
        .expect(400, done);
    });
    //NOTE: this test takes a long time!
    it('should successfully POST', function(done){
      request(app)
        .post('/api/resource')
        .send(sub)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .expect(function(res, err){
          if(!(res.body.success === true)){return 'Incorrect success boolean: '+res.body.success}
          if(!(res.body.url)){return 'URL field is not defined';}
          if(!(res.body.issue)){return 'Issue field is not defined';}
        })
        .end(function(err, res){
          if(err){ return done(err);}
          else{
            //close the pull request
            pullReq.closePullRequest(sub.title, res.body.issue, done);
          }
        });
    });
  });
});
