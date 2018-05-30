var Nightmare = require('nightmare');
var expect = require('chai').expect;
const options = require('../config.json');

describe("Amazon", function() {
  this.timeout(30000);
  it("Should navigate to the Books category", function(done) {
    Nightmare({ show: true })
    .cookies.clearAll()
    .goto(options.startUrl)
    .wait(options.pageIds[0])
    .type(options.pageIds[0], options.category)
    .click(options.pageIds[1])
    .wait(options.pageIds[2])
    .evaluate(function() {
      return document.title
    })
    .then(function(title) {
      console.log(title)
      expect(title).to.equal('Amazon.com: books: Books')
      done();
      nightmare.end();
    })
  });
});
