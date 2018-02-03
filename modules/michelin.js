const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./restaurant_global.txt')
});

lineReader.on('line', function(line) {
  request({
    uri: line,
  }, function(error, response, body) {
    var $ = cheerio.load(body);
    var restaurant = {};
    restaurant['name'] = $('.poi_intro-display-title').text().trim();
    var thoroughfare = $('.poi_intro-display-address .field__items .thoroughfare').text();
    var postalcode = $('.poi_intro-display-address .field__items .postal-code').text();
    var locality = $('.poi_intro-display-address .field__items .locality').text();
    restaurant['address'] = thoroughfare + ", " + postalcode + " " + locality;
    fs.appendFileSync("restaurant_info.json", JSON.stringify(restaurant) + "\n", function(err) {
      if (err) {
        return console.log(err);
      }
    })
  })
});
