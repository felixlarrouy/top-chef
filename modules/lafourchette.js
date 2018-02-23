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
    uri: "https://www.lafourchette.com/recherche/autocomplete?searchText=" + linkParamatersAPI + "&localeCode=fr",
  }, function(error, response, body) {
    if (error) return console.log(error);
    var $ = cheerio.load(body);
    console.log(body);
    var result = JSON.parse(body);
    var restaurants_result = result['data']['restaurants'];
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
    request({
      uri: "https://m.lafourchette.com/api/restaurant/" + matching_resto['id_restaurant'] + "/sale-type",
    }, function(error, response, body) {
      if (error) return console.log(error);
      var $$ = cheerio.load(body);
      var result = JSON.parse(body);
      let restaurant = {}
      let promotions = []
      let hasPromo = false
      let j = 0
      for (var i = 0; i < result.length; i++) {
        // Verifier s'il y a une promotion ou un evenement
        if (result[i].hasOwnProperty('exclusions') && result[i]['exclusions'] != "") {
          hasPromo = true
          promotions[j] = {}
          promotions[j]['title'] = result[i]['title']
          promotions[j]['exclusions'] = result[i]['exclusions']
          j += 1
        }
      }
      if (hasPromo) {
        restaurant['name'] = matching_resto['name']
        restaurant['address'] = restaurant_to_search['address']
        restaurant['stars'] = restaurant_to_search['stars']
        restaurant['promotions'] = promotions

        try {
          fs.appendFile("restaurant_lafourchette.json", JSON.stringify(restaurant) + "\n");
        } catch (err) {
          console.log(err);
        }
      }
    }).on('error', function(err) {
      console.log(err)
    }).end()
  }).on('error', function(err) {
    console.log(err)
  }).end()
});
