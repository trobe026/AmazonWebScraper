const scrapeProductData = require('./scrapeProductData')
const {writeFileSync} = require('fs');

// 'handleLinks' generates an empty array which is added to as each 'scrapeProductData' operation completes. The results are then written locally to ScrapeResults.json.
const handleLinks = links => {
  console.log(`Found ${links.length} results.`)
// Limiting results for testing purposes - can be removed to scrape from all found results.
  var limitLinks = links.slice(0, 3);

  const series = limitLinks.reduce(async (queue, link, i) => {
    const dataArray = await queue;
// each link is processed by 'scrapeProductData'
    dataArray.push(await scrapeProductData(link, i));
    return dataArray;
  }, Promise.resolve([]));

// write to file, filter out any 'undefined' due to failed iteration
  series.then(data => {
    const json = JSON.stringify(data.filter(i => i), null, 4);
    writeFileSync('ScrapeResults.json', json, 'utf8')
  })
  .catch(error => console.log('Search failed:', error));
}

module.exports = handleLinks;