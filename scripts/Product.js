var Nightmare = require('nightmare');
const extractProductData = require('./ExtractProductData')
const options = require('../config.json');
// Scrape requested data points
const Product = async (link, i) => {

console.log(`Extracting data from ${link}`);
const nightmare = new Nightmare( { show: true });

// Nav to product page and scrape data
  try {
    const result = await nightmare
      .goto(link)
// Attempt to click 'paperback' or 'hardback' if not already selected - allows scraping of more book data points.
      .click(options.pageIds[3])
      .wait(options.pageIds[4])
      .evaluate(() => {
        return document.body.innerHTML;
      })
      .end(function(body) {
        return extractProductData(body);
      })
      return {
        product: {
          id: i + 1,
          name: result.name,
          listPrice: result.price,
          description: result.desc,
          product_dimension: result.dimen,
          imageURLs: result.img,
          weight: result.weight,
          sourceURL: link
        }
      };
  } catch(error) {
    console.log(error);
  }
};

module.exports = Product;
