var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

var React = require('react');
var FormComponent = require('../../src/javascripts/components/FormComponent');

var container = document.getElementById('test-container');
var categories = ["", "philosophy", "sources", "redesigns", "inspiration", "tutorials"];
var queryInput = {url: "http://www.designopen.org", title: "Design Open | Home", twitter: "__christianmata"};

describe('Blank Form tests', function(){
  before(function(){
    this.form = React.render(<FormComponent categories={categories} query={{}}/>, container);
  });

  after(function(){
      React.unmountComponentAtNode(container);
  });

  describe('Initialization', function(){
    it('should have an empty Title input', function(){
      var el = document.getElementById('titleInput');
      expect(el).to.exist;
      expect(el.value).to.be.empty;
    });
    it('should have an empty URL input', function(){
      var el = document.getElementById('urlInput');
      expect(el).to.exist;
      expect(el.value).to.be.empty;
    });
    it('should have an empty Twitter input', function(){
      var el = document.getElementById('twitterInput');
      expect(el).to.exist;
      expect(el.value).to.be.empty;
    });
    it('should have an empty Description input', function(){
      var el = document.getElementById('descriptionInput');
      expect(el).to.exist;
      expect(el.value).to.be.empty;
    });
    it('should have an empty Category input', function(){
      var el = document.getElementById('categoryInput');
      expect(el).to.exist;
      expect(el.value).to.be.empty;
    });
    it('should have all the category options', function(){
      var current = [];
      [].forEach.call(document.querySelectorAll('#categoryInput option'), function(elm){
        current.push(elm.value);
      });
      expect(current).to.eql(categories);
    })
    it('should have a submit button', function(){
      var el = document.getElementById('resourceSubmit');
      expect(el).to.exist;
    });
  });

})

describe('Query Form tests', function(){
  before(function(){
    this.form = React.render(<FormComponent categories={categories} query={queryInput}/>, container);
  });

  after(function(){
    React.unmountComponentAtNode(container);
  });

  describe('Initialization', function(){
    it('should have a filled Title input', function(){
      var el = document.getElementById('titleInput');
      expect(el).to.exist;
      expect(el.value).to.eql(queryInput.title);
    });
    it('should have an filled URL input', function(){
      var el = document.getElementById('urlInput');
      expect(el).to.exist;
      expect(el.value).to.eql(queryInput.url);
    });
    it('should have an filled Twitter input', function(){
      var el = document.getElementById('twitterInput');
      expect(el).to.exist;
      expect(el.value).to.eql(queryInput.twitter);
    });
    it('should have an empty Description input', function(){
      var el = document.getElementById('descriptionInput');
      expect(el).to.exist;
      expect(el.value).to.be.empty;
    });
    it('should have an empty Category input', function(){
      var el = document.getElementById('categoryInput');
      expect(el).to.exist;
      expect(el.value).to.be.empty;
    });
    it('should have all the category options', function(){
      var current = [];
      [].forEach.call(document.querySelectorAll('#categoryInput option'), function(elm){
        current.push(elm.value);
      });
      expect(current).to.eql(categories);
    })
    it('should have a submit button', function(){
      var el = document.getElementById('resourceSubmit');
      expect(el).to.exist;
    });
  });
})
