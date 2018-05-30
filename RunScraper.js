var Nightmare = require('nightmare');
const { writeFileSync } = require('fs');
const handleLinks = require('./scripts/handleLinks')

// Custom Scraper Parameters
const options = require('./config.json')

var nightmare = Nightmare({ show: false })
var links = [];
console.log(`Searching for ${options.category}...`)
// Go to to Starting Url, navigate to 'books' page.
nightmare
  .cookies.clearAll()
  .goto(options.startUrl)
  .wait(options.pageIds[0])
  .type(options.pageIds[0], options.category)
  .click(options.pageIds[1])
  .wait(options.pageIds[2])
// Gather all links to books
  links = nightmare.evaluate(function() {
  return Array.from(document.querySelectorAll('.acs_product-image')).map(a => a.href);
  })
  .end()
  .then(function(links) {
    handleLinks(links)
  });
