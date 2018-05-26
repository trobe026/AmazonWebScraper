var cheerio = require("cheerio");
var category = 'books';

module.exports = {

  'Amazon Book Scraper': function(client) {
    let ids = [];
    client
      .url('http://amazon.com')
      .waitForElementVisible('body')
      .assert.title('Amazon.com: Online Shopping for Electronics, Apparel, Computers, Books, DVDs & more')
      .setValue('#twotabsearchtextbox', category)
      .click('.nav-input')
      .elements('css selector', '.aok-align-center', function(links) {
        // for (let i = 0; i < links.value.length; i++) {
        //   console.log(links.value[i])
        //   client.elementIdClick(links.value[i].ELEMENT, function() {
        //     console.log(i)
        //     client.back();
        //   });
        //
        //   client.pause(1000);
        // }
        for (var i = 0; i < links.value.length; i++) {
          ids.push(links.value[i].ELEMENT);
          ids.forEach(function(link, j) {
            client.pause(3000)
            .elementIdClick(link, function() {
              client.back()
            })
          })
        }

        // for (let j = 0; j < 5; j++) {
        // (function(cntr) {
        //   client.elementIdClick(ids[j], function() {
        //     client.back()
        //     client.pause(3000)
        //     console.log(ids[j])
        //   })
        // })
        //
        //
        // }
        console.log(links.value)
      })
      .end()


  }

}
