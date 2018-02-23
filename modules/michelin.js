const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');

if (fs.existsSync('./restaurant_info.json')) {
  fs.truncate('restaurant_info.json', 0, function() {
    console.log('done');
  })
}

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./restaurant_links.txt')
});

lineReader.on('line', function(line) {
  request({
    uri: line,
  }, function(error, response, body) {
    if (error) return console.log(error);
    var $ = cheerio.load(body);
    var restaurant = {};
    restaurant['name'] = $('.poi_intro-display-title').text().trim();
    var thoroughfare = $('.poi_intro-display-address .field__items .thoroughfare').text();
    var postalcode = $('.poi_intro-display-address .field__items .postal-code').text();
    var locality = $('.poi_intro-display-address .field__items .locality').text();
    restaurant['stars'] = $('#node_poi-guide-wrapper > div.node_poi-distinction-section > ul > li:nth-child(1) > div.content-wrapper').text()
    var address = {};
    address['thoroughfare'] = thoroughfare;
    address['postalcode'] = postalcode;
    address['locality'] = locality;
    restaurant['address'] = address;
    restaurant['picture'] = $('#panels-content-main-leftwrapper > div.panel-panel.panels-content-main-left > div > div > ul > li:nth-child(2) > div > a > div.poi_card-picture > img')
    try {
      //TODO: regarder si le doc existe, si oui vider son contenu (ou le supprimer et en créer un nouveau)
      fs.appendFile("restaurant_info.json", JSON.stringify(restaurant) + "\n");
    } catch (err) {
      console.log(err);
    }
  }).on('error', function(err) {
    console.log(err)
  }).end()
});
