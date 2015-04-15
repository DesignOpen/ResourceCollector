
describe('Resource Collector Site', function() {
  before(function() {
    casper.start('http://localhost:5000');
  });

  it('check for the title', function() {
    casper.then(function() {
      // 'Design Open: Add Design Resource'.should.matchTitle;
      // casper.findOne('#titleInput').should.be.empty;
      casper.getTitle().should.contain('Design Open: Add Design Resource');
      console.log('HTML: ', casper.getPageContent());
    });
  });

  // it('should have an empty Title input', function(){
  //   casper.then(function(){
  //     var titleInput = casper.findOne('#titleInput')
  //     console.log('titleInput: ', titleInput);
  //     expect(titleInput.value).to.be.empty;
  //   })
  // });
  // it('should have an empty URL input', function(){
  //   expect('#urlInput').to.be.empty;
  // })
  // it('should have an empty Twitter Handle', function(){
  //   expect('#twitterInput').to.be.empty;
  // })
  // it('should have an empty Description input', function(){
  //   expect('#categoryInput').to.be.empty;
  // })

});
