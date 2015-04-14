var mocha = require('mocha');
var expect = require('chai').expect;
var request = require('supertest');

describe("simple test suite", function() {
  describe("constructor", function() {
    var thing = {
      name: 'Ben',
      age: 10,
      occupation: 'student'
    }
    it("should have a name", function() {
      expect(thing.name).to.equal("Ben");
    });

    it("should have an age", function() {
      expect(thing.age).to.equal(10);
    });
  });
});
