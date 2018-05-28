var cheerio = require("cheerio");
var category = 'books';
const linkList = [];


module.exports = {

  before: function(client) {
    client
      .url('http://amazon.com')
      .waitForElementVisible('body')
      .assert.title('Amazon.com: Online Shopping for Electronics, Apparel, Computers, Books, DVDs & more')
      .setValue('#twotabsearchtextbox', category)
      .click('.nav-input')
  },

  // beforeEach: function(client) {
  //   client
  //   .elements('css selector', '.aok-align-center', function(links) {
  //     for (var i = 0; i < links.value.length; i++) {
  //       ids.push(links.value[i].ELEMENT);
  //     }
  //   })
  // },
  'Gather links': function(client) {
    client
      .elements('css selector', '.aok-align-center', function(links) {
        for (var i = 0; i <links.value.length; i++) {
          linkList.push(links.value[i].ELEMENT)
          done()
        })
      })
  }
  'Amazon Book Scraper': function(client) {

        for (var i = 0; i < links.value.length) {


            iterate(function() {
              client
              .elementIdClick(links.value[i].ELEMENT)
              .waitForElementVisible('body')
            })
            client.back(function() {
              i++;
            })
        }



        // for (var i = 0; i < result1.value.length; i++) {
        //   client
        //     .elementIdClick(result1.value[i].ELEMENT, function(print) {
        //
        //     });
        //     console.log(i)
        //     client.back();
        //     client.waitForElementVisible('body')
        // }


    // ids.forEach(function(link, i) {
    //   setInterval(scrape.bind(null, link), 2000);
    // });
  }

  //
  // 'Amazon Book Scraper': function(client) {
  //
  //
  //  const ids = [];
  //   client
  //     .url('http://amazon.com')
  //     .waitForElementVisible('body')
  //     .assert.title('Amazon.com: Online Shopping for Electronics, Apparel, Computers, Books, DVDs & more')
  //     .setValue('#twotabsearchtextbox', category)
  //     .click('.nav-input')
  //     .elements('css selector', '.aok-align-center',  function(links) {
  //       for (var i = 0; i < links.value.length; i++) {
  //         // ids.push(links.value[i].ELEMENT);
  //         let link = links.value[i].ELEMENT;
  //         setTimeout(function(link) {
  //           scrape(link);
  //         }, 2000)
  //       }
        // ids.forEach(function(link, j) {
        //   client
        //   .elementIdClick(link, (function() {
        //     client
        //     .back()
        //     .pause(1000)
        //   })())
        //   })
        // console.log(ids)
        // for (var i = 0; i < ids.length; i++) {
        //   link = ids[i]
        //   scrape(link);
        // }
      //   ids.forEach(function(link, j) {
      //     scrape(link)
      //     console.log(j)
      // })

        // client
        //   .elementIdClick(link)
        //   .pause(1000)
        //   .back()
      // })
      // .back(function() {
      //   ids.forEach(function(link, j) {
      //       client
      //         .elementIdClick(link)
      //         .pause(1000)
      //   })
      // })
      // client.end()
    // }
  }
