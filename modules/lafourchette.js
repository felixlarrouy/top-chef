const request = require('request');
const fs = require('fs');

if (fs.existsSync('docs/react-app/src/lafourchette_promotions.json')) {
  fs.truncate('docs/react-app/src/lafourchette_promotions.json', 0, function() {
    console.log('done');
  })
}

exports.findPromotions = function() {
  var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('./lafourchette_restaurants.json')
  });

  lineReader.on('line', function(line) {
    let content = JSON.parse(line)
    request({
      uri: content['link'],
    }, function(error, response, body) {
      if (error) return console.log(error);
      var result = JSON.parse(body);
      let restaurant = {}
      let promotions = []
      let hasPromo = false
      let j = 0
      for (var i = 0; i < result.length; i++) {
        // Verifier s'il y a une promotion ou un evenement
        if (result[i].hasOwnProperty('exclusions') && result[i]['exclusions'] != "" && result[i]['is_special_offer']) {
          hasPromo = true
          promotions[j] = {}
          promotions[j]['title'] = result[i]['title']
          promotions[j]['exclusions'] = result[i]['exclusions']
          j += 1
        }
      }
      if (hasPromo) {
        restaurant['name'] = content['name']
        restaurant['address'] = content['address']
        restaurant['stars'] = content['stars']
        restaurant['promotions'] = promotions

        try {
          fs.appendFile("docs/react-app/src/lafourchette_promotions.json", JSON.stringify(restaurant) + ",\n");
        } catch (err) {
          console.log(err);
        }
      }
    }).on('error', function(err) {
      console.log(err)
    }).end()
  });
}
