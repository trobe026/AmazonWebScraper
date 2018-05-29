var Nightmare = require('nightmare');
var cheerio = require("cheerio");

// Scrape requested data points
const getProductInfo = async (link, i) => {

console.log(`Extracting data from ${link}`);
const nightmare = new Nightmare( { show: true });

// clear cookies and go to product page
  try {
    await nightmare
    .cookies.clearAll()
    .goto(link)
  } catch(error) {
    console.log(error);
  }

  try {
    const result = await nightmare
      // attempt to click paperback or hardback if not already selected - allows scraping of more data points
      .click('#a-autoid-2-announce')
      .wait('title')
      .evaluate(() => {
        return document.body.innerHTML;
      })
      .end(function(body) {
        var $ = cheerio.load(body);
        var results = {};
        $('#dp-container').each(function(i, element) {
          // Get Book Name
          results.name = $(element).find('h1[id="title"]').find('span[class=a-size-large]' || 'span[class=a-size-extra-large]').text().trim();
          // Get Book Price
          results.price = $(element).find('#buyNewSection > a > h5 > div > div.a-column.a-span8.a-text-right.a-span-last > div > span.a-size-medium.a-color-price.offer-price.a-text-normal').text();
          if (results.price === "") {
            results.price = $(element).find('#buyNewSection > h5 > div > div.a-column.a-span8.a-text-right.a-span-last > div > span.a-size-medium.a-color-price.offer-price.a-text-normal').text();
          }
          // Get Book Description
          var desc = $(body).find('noscript').text().trim();
          desc = /\t(.+)/.exec(desc)[1];
          desc = desc.replace(/&.*?;|div|p|\//g, '');
          results.desc = desc;
          // Get Book Dimensions and Weight
          // Iterate through 'product details' table and return text values where "Product" or "Shipping" are found
          results.dimen = results.weight = '';
          $('#productDetailsTable > tbody > tr > td > div > ul > li').each(function() {
            if ($(this).text().match(/Product/g)) {
              results.dimen = $(this).contents().filter(function() {
                return this.nodeType == 3;
              }).text().trim();
            }
            if ($(this).text().match(/Shipping/g)) {
              let weight = $(this).contents().filter(function() {
                return this.nodeType == 3;
              }).text().trim();
              weight = weight.replace(/[()]/g, '');
              results.weight = weight;
            }
          })
          // Get all Book Images
          results.img = [];
          $('.a-spacing-micro > img').each(function(i, element) {
            results.img.push($(element).attr('src'));
          })
          results.img.push($('#main-image').attr('src'))
        })

        var removeNull = function(results) {
          Object.keys(results).forEach(function(key) {
            if (results[key] === '') {
              results[key] = 'Data Point Unavailable for Product'
            }
          });
          return results;
        }
        return removeNull(results);
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

module.exports = getProductInfo;
