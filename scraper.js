var Nightmare = require('nightmare');
const {writeFileSync} = require('fs');

const category = 'books';
const startUrl = 'http://amazon.com';
const pageIds = [
  '#twotabsearchtextbox',
  '.nav-input',
  '.acs_product-image'
];

const getProductInfo = require('./getProductInfo')
// Gather all links to books - show: true to display browser nav
var nightmare = Nightmare({ show: false })
console.log(`Searching for ${category}...`)
nightmare
// Go to to Starting Url, navigate to 'books' page.
  .goto(startUrl)
  .wait(pageIds[0])
  .type(pageIds[0], category)
  .click(pageIds[1])
  .wait(pageIds[2])
  links = nightmare.evaluate(function() {
  return Array.from(document.querySelectorAll('.acs_product-image')).map(a => a.href);
  })
  .end()
  .then(function(links) {
    console.log(`Found ${links.length} results.`)
    // Limit results to 1 for testing purposes, can be removed in production.
    var limitLinks = links.slice(0, 5);

    const series = limitLinks.reduce(async (queue, link, i) => {
      const dataArray = await queue;
      dataArray.push(await getProductInfo(link, i));
      return dataArray;
    }, Promise.resolve([]));

    series.then(data => {
      const json = JSON.stringify(data.filter(i => i), null, 4);
      writeFileSync('ScrapeResults.json', json, 'utf8')
    })
    .catch(error => console.log('Search failed:', error));
  });
