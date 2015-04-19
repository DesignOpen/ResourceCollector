var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

var React = require('react');
var FormComponent = require('../../src/javascripts/components/FormComponent');

var container = document.getElementById('test-container');

describe('Form tests', function(){
  before(function(){
    var categories = ["", "philosophy", "sources", "redesigns", "inspiration", "tutorials"];
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
    it('should have a submit button', function(){
      var el = document.getElementById('resourceSubmit');
      expect(el).to.exist;
    });
  });

})
