var expect = require('chai').expect();
var sinon = require('sinon');
var phantom = require('phantom');

// Testing the ParseURL functionality
describe('ParseURL functionality', function(){
  describe('Empty URL', function(){
    phantom.create(function(ph){
      console.log('pooop')
      ph.createPage(function(page){
        page.open('http://localhost:5000', function(status) {
          console.log("Status: " + status);
          if(status === "success") {
            var el = document.getElementById('titleInput');
            it('should have an empty Title input', function(){
              expect(el.value).to.be.empty;
            });
            it('should have an empty URL input', function(){
              expect(document.getElementById('urlInput').value).to.be.empty;
            })
            it('should have an empty Twitter Handle', function(){
              expect(document.getElementById('twitterInput').value).to.be.empty;
            })
            it('should have an empty Description input', function(){
              expect(document.getElementById('categoryInput').value).to.be.empty;
            })
          }
          phantom.exit();
        });
      })
    })
  });
});
