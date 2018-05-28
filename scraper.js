var request = require("request");
var cheerio = require("cheerio");
var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true })
const category = 'books';
const startUrl = 'http://amazon.com';
const pageIds = [
  '#twotabsearchtextbox',
  '.nav-input',
  '.aok-align-center'
]


const linkList = async id => {};

const getProductInfo = async link => {

  console.log(`Extracting ${category} info from ${link}`);
  const nightmare = new Nightmare( { show: true });

  try {
    await nightmare
      .goto(startUrl)
      .wait(pageIds[0])
      .type(pageIds[0], category)
      .click(pageIds[1])
      .
  }

}

nightmare
  .goto('http://amazon.com')
  .type('#twotabsearchtextbox', category)
  .click()
  .wait()
  .end()
  .then(function(result) {
    console.log(result)
    console.log('test')
  })
  .catch(function(error) {
    console.error('Search failed:', error)
  });

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
