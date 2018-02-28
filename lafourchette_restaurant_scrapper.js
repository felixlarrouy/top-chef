const request = require('request');
const fs = require('fs');

if (fs.existsSync('./lafourchette_restaurants.json')) {
  fs.truncate('lafourchette_restaurants.json', 0, function() {})
}

let separators = ['\'', ' ', '-'];
let regExp = new RegExp('[' + separators.join('') + ']', 'g')
let matching_resto = {}
var picture = ""

console.log("Looking for michelin restaurants on lafourchette...");

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
    if (body[0] != '<') {
      var restaurants_result = JSON.parse(body);
      let restaurant_found = false
      if (restaurants_result.length > 0) {
        for (var i = 0; i < restaurants_result.length; i++) {
          if (restaurant_found) {
            break; // There is no need to keep searching if the restaurant was found
          }
          // trouver le restaurant de la liste (s'il existe) avec le même zipcode et la même ville
          if (restaurants_result[i]['address']['postal_code'] == restaurant_to_search['address']['postalcode']) {
            console.log("A michelin restaurant has been found on lafourchette !");
            matching_resto = restaurants_result[i]

            let tokensSearch = matching_resto["name"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ - /g, '-').split(regExp);
            var searchLinkParameters = "";
            for (var i = 0; i < tokensSearch.length - 1; i++) {
              searchLinkParameters += tokensSearch[i] + '-';
            }
            searchLinkParameters += tokensSearch[tokensSearch.length - 1];
            matching_resto['stars'] = restaurant_to_search['stars']
            matching_resto['link'] = "https://www.lafourchette.com/restaurant/" + searchLinkParameters + "/" + matching_resto['id']
            restaurant_found = true
          }
        }

        if (restaurant_found) {
          try {
            fs.appendFile("lafourchette_restaurants.json", JSON.stringify(matching_resto) + "\n", function() {});
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
