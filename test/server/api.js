var mocha = require('mocha');
var expect = require('chai').expect;
var request = require('supertest');

describe("simple test suite", function() {
  describe("constructor", function() {
    it("should have be true", function() {
      expect(true).to.be.true;
    });
  });
});
