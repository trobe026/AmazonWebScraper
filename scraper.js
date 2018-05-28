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

nightmare
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
    var limitLinks = links.slice(0, 2);
    // console.log(limitLinks)
    const series = limitLinks.reduce(async (queue, link) => {
      const dataArray = await queue;
      dataArray.push(await getProductInfo(link));
      console.log(dataArray)
      return dataArray;
    }, Promise.resolve([]));

    series.then(data => {
      const json = JSON.stringify(data.filter(i => i));
      writeFileSync('ScrapeResults.json', json, 'utf8')
    })
    .catch(error => console.log('Search failed:', error));
  });


const getProductInfo = async link => {

  console.log(`Extracting "${category}" data from ${link}`);
  const nightmare = new Nightmare( { show: true });

// Go to to Starting Url, navigate to 'books' page.
  try {
    await nightmare
      .goto(startUrl)
      .wait(pageIds[0])
      .type(pageIds[0], category)
      .click(pageIds[1]);
  } catch(error) {
    console.log(error);
  }

  // click on link to book being fed to function
  try {
    await nightmare
    .wait(pageIds[2])
    .goto(link)
  } catch(error) {
    console.log(error);
  }

  try {
    const result = await nightmare
      .wait('#productDetailsTable')
      .evaluate(() => {
        return [...document.querySelectorAll('#title')].map(el => el.innerText);
      })
      .end();
      return { link, info: result[0], moreinfo:result[1]}
  } catch(error) {
    console.log('error');
    return undefined;
  }
};




// module.exports = function(app) {
//   app.get('/scrape', function(req, res) {
//     request('http://www.kxan.com', function(err, resp, html) {
//       var $ = cheerio.load(html);
//       var results = {};
//       $('#p_p_id_56_INSTANCE_3234_ li').each(function(i, element) {
//         var imgUrl = $(element).find('figure').attr('style');
//         results.img = imgUrl.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');
//         results.title = $(element).find('.headline').children('a').text();
//         results.body = $(element).find('.headline-wrapper').children('p').text();
//         results.link = 'http://www.kxan.com' + $(element).find('.image-wrapper').children('a').attr('href');
//       // in case an article contains title only
//         if (results.body === '') {
//           results.body = "Whoops! Looks like this article has no body. Click the link!"
//         }
//
//         db.Headline.create(results)
//         .then(function(dbStory) {
//           // console.log(dbStory);
//         })
//         .catch(function(err) {
//           console.log(err)
//         });
//       });
//       res.redirect('/');
//     });
//   });
// }
