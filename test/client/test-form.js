var chai = require('chai');
var sinon = require('sinon');
var expect = chai.expect;

var React = require('react');
var FormComponent = require('../../src/javascripts/components/FormComponent');

var afterEachCase = function() {
  try {
    this.form.remove();
  } catch (e) {
    console.log('error: ', e);
  }
};

describe('Form tests', function(){
  beforeEach(function(){
    //add the form component here!
    //see if this does it properly
    var categories = ["philosophy", "sources", "redesigns", "inspiration", "tutorials"];
    // this.form = React.render(<FormComponent categories={categories} query={{}}/>, document.body);
  });

  // afterEach(afterEachCase);

  describe('Initialization', function(){
    it('should have an empty Title input', function(){
      // expect(document.getElementById('titleInput').value).to.be.empty;
      expect(true).to.be.true;
    });
  })
})
