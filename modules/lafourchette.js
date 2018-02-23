const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');

if (fs.existsSync('../restaurant_lafourchette.json')) {
  fs.truncate('restaurant_lafourchette.json', 0, function() {
    console.log('done');
  })
}

let separators = ['\'', ' ', '-'];
let regExp = new RegExp('[' + separators.join('') + ']', 'g')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./restaurant_info.json')
});

lineReader.on('line', function(line) {
  var restaurant_to_search = JSON.parse(line);
  var tokensAPI = restaurant_to_search["name"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ - /g, '-').split(regExp);
  var linkParamatersAPI = "";
  for (var i = 0; i < tokensAPI.length - 1; i++) {
    linkParamatersAPI += tokensAPI[i] + '+';
  }
  linkParamatersAPI += tokensAPI[tokensAPI.length - 1];
  request({
    uri: "https://m.lafourchette.com/api/restaurant-prediction?name=" + linkParamatersAPI,
  }, function(error, response, body) {
    if (error) return console.log(error);
    var $ = cheerio.load(body);
    var restaurants_result = JSON.parse(body);
    let restaurant_found = false
    let matching_resto = {}
    for (var i = 0; i < restaurants_result.length; i++) {
      if (restaurant_found) {
        break; // There is no need to keep searching if the restaurant was found
      }
      // trouver le restaurant de la liste (s'il existe) avec le même zipcode et la même ville
      if (restaurants_result[i]['zipcode'] == restaurant_to_search['address']['postalcode']) {
        matching_resto = restaurants_result[i]
        restaurant_found = true
      }
    }
  }).on('error', function(err) {
    console.log(err)
  }).end()
});
