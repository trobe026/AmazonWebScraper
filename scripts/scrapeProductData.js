var Nightmare = require('nightmare');
const gatherData = require('./gatherData')

// Scrape requested data points
const scrapeProductData = async (link, i) => {

console.log(`Extracting data from ${link}`);
const nightmare = new Nightmare( { show: true });

// Nav to product page and scrape data
  try {
    const result = await nightmare
      .goto(link)
// attempt to click 'paperback' or 'hardback' if not already selected - allows scraping of more data points
      .click('#a-autoid-2-announce')
      .wait('title')
      .evaluate(() => {
        return document.body.innerHTML;
      })
      .end(function(body) {
        return gatherData(body);
      })
      return {
        product: {
          id: i + 1,
          name: result.name,
          listPrice: result.price,
          description: result.desc,
          product_dimension: result.dimen,
          weight: result.weight,
          imageURLs: result.img,
          sourceURL: link
        }
      };
  } catch(error) {
    console.log(error);
  }
};

module.exports = scrapeProductData;
