var cheerio = require("cheerio");
const removeNull = require('../helpers/removeNull');

const extractProductData = body => {
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
  return removeNull(results);
}

module.exports = extractProductData;
