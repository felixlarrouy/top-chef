const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');

if (fs.existsSync('./lafourchette_links.txt')) {
  fs.truncate('lafourchette_links.txt', 0, function() {
  })
}

let separators = ['\'', ' ', '-'];
let regExp = new RegExp('[' + separators.join('') + ']', 'g')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./michelin_restaurants.json')
});

lineReader.on('line', function(line) {
  var restaurant_to_search = JSON.parse(line);
  var tokensAPI = restaurant_to_search["name"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ - /g, '-').split(regExp);
  let linkParamatersAPI = "";
  for (var i = 0; i < tokensAPI.length - 1; i++) {
    linkParamatersAPI += tokensAPI[i] + '+';
  }
  linkParamatersAPI += tokensAPI[tokensAPI.length - 1];
  request({
    uri: "https://m.lafourchette.com/api/restaurant-prediction?name=" + linkParamatersAPI,
  }, function(error, response, body) {
    if (error) return console.log(error);
    var $ = cheerio.load(body);
    if (body[0] != '<') {
      var restaurants_result = JSON.parse(body);
      let restaurant_found = false
      let matching_resto = {}
      if(restaurants_result.length > 0) {
        for (var i = 0; i < restaurants_result.length; i++) {
          if (restaurant_found) {
            console.log("restaurant found");
            break; // There is no need to keep searching if the restaurant was found
          }
          // trouver le restaurant de la liste (s'il existe) avec le même zipcode et la même ville
          if (restaurants_result[i]['address']['postal_code'] == restaurant_to_search['address']['postalcode']) {
            matching_resto = restaurants_result[i]
            restaurant_found = true
          }
        }
        if (restaurant_found) {
          try {
            let link = "https://m.lafourchette.com/api/restaurant/" + matching_resto['id'] + "/sale-type"
            fs.appendFile("lafourchette_links.txt", link + "\n");
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  }).on('error', function(err) {
    console.log(err)
  }).end()
});
