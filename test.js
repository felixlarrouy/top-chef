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
