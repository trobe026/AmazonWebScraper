var request = require("request");
var cheerio = require("cheerio");
const htmlparser2 = require('htmlparser2');
var Nightmare = require('nightmare');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
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
// jsdom testing

  console.log(`Extracting "${category}" data from ${link}`);
  const nightmare = new Nightmare( { show: true });

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
      .click('a > #bdSeeAllPrompt')
      .click('#a-autoid-2-announce' || '#a-autoid-3-announce' || '#a-autoid-4-announce')
      .wait('title')
      .evaluate(() => {
        return document.body.innerHTML;
      })
      .end(function(body) {
        // console.log(body)
        var $ = cheerio.load(body);
        var results = {};
        $('#dp-container').each(function(i, element) {
          results.name = $(element).find('h1[id="title"]').find('span[class=a-size-large]' || 'span[class=a-size-extra-large]').text().trim();

          results.price = $(element).find('#buyNewSection > a > h5 > div > div.a-column.a-span8.a-text-right.a-span-last > div > span.a-size-medium.a-color-price.offer-price.a-text-normal').text();
          if (results.price === "") {
            results.price = $(element).find('#buyNewSection > h5 > div > div.a-column.a-span8.a-text-right.a-span-last > div > span.a-size-medium.a-color-price.offer-price.a-text-normal').text();
          }
          // Was unable to find src of iframe to scrape from on amazon
          var desc = $(body).find('noscript').text().trim();
          desc = /\t(.+)/.exec(desc)[1];
          desc = desc.replace(/&.*?;|div|p|\//g, '');
          results.desc = desc;
          // results.desc = $('#iframeContent', top.window.frames[0].document)
          const dom = new JSDOM(body, {
            url: link,
            referrer: link,
            contentType: 'text/html',
            resources: 'usable'
          });
          var x = dom.window.document.querySelector('#bookDesc_iframe').contentWindow;
          console.log(x.document.getElementsByTagName("body").innerHTML)
          // console.log(body)
          $('#productDetailsTable > tbody > tr > td > div > ul > li').each(function() {
            if ($(this).text().match(/Product/g)) {
              results.dimen = $(this).contents().filter(function() {
                return this.nodeType == 3;
              }).text().trim();
            }
            if ($(this).text().match(/Shipping/g)) {
              results.weight = $(this).contents().filter(function() {
                return this.nodeType == 3;
              }).text().trim();
            }
          })


          // $('#productDetailsTable > tbody > tr > td > div > ul > li').each(function(i, element) {
          //   if (element:contains('Product Dimensions:') {
          //     results.dimen = element.contents().filter(function() {
          //       return this.nodeType == 3;
          //   }).text().trim();
          //   if (element:contains('Shipping Weight:') {
          //     results.weight = element.contents().filter(function() {
          //       return this.nodeType == 3;
          //     }).text().trim();
          //   })
          // }))
          // results.dimen = $(element).find('#productDetailsTable > tbody > tr > td > div > ul > li:nth-child(7)').contents().filter(function() {
          //   return this.nodeType == 3;
          // }).text().trim();
          //
          // results.weight = $(element).find('#productDetailsTable > tbody > tr > td > div > ul > li:nth-child(8)').contents().filter(function() {
          //   return this.nodeType == 3;
          // }).text().trim();

          results.img = [];
          $('.a-spacing-micro > img').each(function(i, element) {
            results.img.push($(element).attr('src'));
          })
          results.img.push($('#main-image').attr('src'))
          // var imgUrl = 'test'
          // results.img = imgUrl;
// #productDetailsTable > tbody > tr > td > div > ul > li:nth-child(7) > b
        })
        // console.log(results.desc)

        return results;
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
    return undefined;
  }
};
