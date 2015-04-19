var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

var React = require('react');
var FormComponent = require('../../src/javascripts/components/FormComponent');

var container = document.getElementById('test-container');

describe('Form tests', function(){
  before(function(){
    var categories = ["philosophy", "sources", "redesigns", "inspiration", "tutorials"];
    this.form = React.render(<FormComponent categories={categories} query={{}}/>, container);
  });

  after(function(){
      React.unmountComponentAtNode(container);
  });

  describe('Initialization', function(){
    it('should have an empty Title input', function(){
      var el = document.getElementById('titleInput');
      expect(el.value).to.be.empty;
    });
  })
})
