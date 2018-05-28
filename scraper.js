var request = require("request");
var cheerio = require("cheerio");
var Nightmare = require('nightmare');
const { readFileSync, writeFileSync } = require('fs');
var nightmare = Nightmare({ show: false })
var links = [];
const category = 'books';
const startUrl = 'http://amazon.com';
const pageIds = [
  '#twotabsearchtextbox',
  '.nav-input',
  '.acs_product-image'
];


// Gather all links to books
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
    var limitLinks = links.slice(0, 1);

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

// Scrape requested data points
const getProductInfo = async (link, i) => {
  console.log(`Extracting "${category}" data from ${link}`);
  const nightmare = new Nightmare( { show: true });

  try {
    await nightmare
    .goto(link)
  } catch(error) {
    console.log(error);
  }

  try {
    const result = await nightmare
      // .wait('body')
      // attempt to click paperback or hardback if not already selected - allows higher % of scraped data points
      .click('#a-autoid-2-announce' || '#a-autoid-3-announce' || '#a-autoid-4-announce')
      // .wait('body')
      // .evaluate(() => {
      //   return [...document.querySelectorAll('#title')].map(el => el.innerText);
      // })
      // .end();
      // console.log(result)
      // return {
      //   product: {
      //     id: 1,
      //     name: result,
      //     listPrice: result,
      //     description: result,
      //     product_dimension: result,
      //     imageURLs: [],
      //     weight: result,
      //     sourceURL: link
      //   }
      // }


      .evaluate(() => {
        return document.body.innerHTML;
      })
      .end(function(body) {
        var $ = cheerio.load(body)
        var results = {};
        $('#dp-container').each(function(i, element) {
          results.name = $(element).find('h1[id="title"]').find('span[class=a-size-large]' || 'span[class=a-size-extra-large]').text().trim();

          results.price = $(element).find('#buyNewSection > a > h5 > div > div.a-column.a-span8.a-text-right.a-span-last > div > span.a-size-medium.a-color-price.offer-price.a-text-normal').text();
          if (results.price === "") {
            results.price = $(element).find('#buyNewSection > h5 > div > div.a-column.a-span8.a-text-right.a-span-last > div > span.a-size-medium.a-color-price.offer-price.a-text-normal').text();
          }

          results.desc = $(element).find('#bookDesc_iframe > html > body > #iframeContent').text();
          // results.desc = 'test';

          results.dimen = $(element).find('#productDetailsTable > tbody > tr > td > div > ul > li:nth-child(6)').text();
          // results.dimen = 'test';

          results.weight = $(element).find('#productDetailsTable > tbody > tr > td > div > ul > li:nth-child(7)').text();
          // results.weight = 'test';

          // var imgUrl = 'test'
          // results.img = imgUrl;

        })
        return results;
      })
      return {
        product: {
          id: i + 1,
          name: result.name,
          listPrice: result.price,
          description: result.desc,
          product_dimension: result.dimen,
          // imageURLs: [],
          // weight: result,
          sourceURL: link
        }
      };
  } catch(error) {
    console.log(error);
    return undefined;
  }
};
