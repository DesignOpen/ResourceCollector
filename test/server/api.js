var mocha = require('mocha');
var expect = require('chai').expect;
var request = require('supertest');

describe("API Test", function() {
  before(function(){
    var d = new Date();
    sub = {
      title: 'API Testing '+d.toTimeString(),
      url: 'http://www.designopen.com',
      category: 'sources',
      twitter: '@__christianmata',
      description: 'Something amazing! To test the API with.'
    }
  });

  describe('GET /', function(){
    it('should return a HTML page', function(done){
      request('http://localhost:5000')
        .get('/')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200, done);
    });
  });

  describe('GET /javascripts/bookmarklet.js', function(){
    it('should return bookmarklet JS', function(done){
      request('http://localhost:5000')
        .get('/javascripts/bookmarklet.js')
        .expect('Content-Type', 'application/javascript')
        .expect(200, done);
    });
  });

  describe('GET /javascripts/form.js', function(){
    it('should return a form JS', function(done){
      request('http://localhost:5000')
        .get('/javascripts/form.js')
        .expect('Content-Type', 'application/javascript')
        .expect(200, done);
    });
  });

  describe("POST /api/resource", function() {
    it('should reject empty POST', function(done){
      request('http://localhost:5000')
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
      request('http://localhost:5000')
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
      request('http://localhost:5000')
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
      request('http://localhost:5000')
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
      request('http://localhost:5000')
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
      this.timeout(0);
      request('http://localhost:5000')
        .post('/api/resource')
        .send({title:'API Test', URL:'http://designopen.com', twitter:'@OSDRC_testing', category: 'sources', description:'A description'})
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(function(res){
          if(!(res.body.success === false)){return 'Incorrect success boolean: '+res.body.success}
          if(!(res.body.error === 'Please enter a valid Twitter handle.')){ return 'Incorrect error text: "'+res.body.error+'"';}
        })
        .expect(400, done);
    });
  });
});
