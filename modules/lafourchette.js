const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');

let separators = ['\'', ' ', '-'];
let regExp = new RegExp('[' + separators.join('') + ']', 'g')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./restaurant_info.json')
});

lineReader.on('line', function(line) {
  var restaurant_to_search = JSON.parse(line);
  var name = encodeURIComponent(restaurant_to_search["name"])
  // var tokensAPI = restaurant_to_search["name"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ - /g, '-').split(regExp);
  // var linkParamatersAPI = "";
  // for (var i = 0; i < tokensAPI.length - 1; i++) {
  //   linkParamatersAPI += tokensAPI[i] + '+';
  // }
  // linkParamatersAPI += tokensAPI[tokensAPI.length - 1];
  request({
    //uri: "https://www.lafourchette.com/recherche/autocomplete?searchText=" + linkParamatersAPI + "&localeCode=fr",
    uri: "https://m.lafourchette.com/api/restaurant-prediction?name=" + name,
  }, function(error, response, body) {
    if (error) return console.log(error);
    var $ = cheerio.load(body);
    var result = JSON.parse(body);
    var restaurants_result = result['data']['restaurants'];
    for (var i = 0; i < restaurants_result.length; i++) {
      // trouver le restaurant de la liste (s'il existe) avec le même zipcode et la même ville
      if (restaurants_result[i]['zipcode'] == restaurant_to_search['address']['postalcode']) {
        let matching_resto = restaurants_result[i]
        let tokensSearch = matching_resto["name"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/ - /g, '-').split(regExp);
        var searchLinkParameters = "";
        for (var i = 0; i < tokensSearch.length - 1; i++) {
          searchLinkParameters += tokensSearch[i] + '-';
        }
        searchLinkParameters += tokensSearch[tokensSearch.length - 1];
        // aller sur la page de ce restaurant
        request({
          uri: "https://www.lafourchette.com/restaurant/" + searchLinkParameters + "/" + matching_resto['id_restaurant'],
        }, function(error, response, body) {
          if (error) return console.log(error);
          var $$ = cheerio.load(body);
          // scrapper promotions and events
          var restaurant = {}
          restaurant['name'] = matching_resto['name']
          var address = {}
          address['city'] = matching_resto['city']
          address['zipcode'] = matching_resto['zipcode']
          restaurant['address'] = address
          restaurant['event'] = $$('.saleType.saleType--event .saleType-title').text()
          restaurant['promotions'] = $$('.saleType.saleType--specialOffer .saleType-title').text()
          try {
            fs.appendFile("restaurant_lafourchette.json", JSON.stringify(restaurant) + "\n");
          } catch (err) {
            console.log(err);
          }
        }).on('error', function(err) {
          console.log(err)
        }).end()
      }
    }
  }).on('error', function(err) {
    console.log(err)
  }).end()
});
