const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');

request({
  uri: "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin",
}, function(error, response, body) {
  var $ = cheerio.load(body)

  //TODO: récupérer le nombre de pages et boucler pour scrapper toutes les pages
  var restaurantList = [];

  $('.poi-card-link').each(function(index, element) {
    restaurantList[index] = {};
    var link = $(this);
    restaurantList[index]['url'] = link.attr('href');
    restaurantList[index]['title'] = $(link).find('.poi_card-display-title').text().trim();
  });
  fs.writeFile("restaurant_global.json", JSON.stringify(restaurantList), function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
  console.log(restaurantList); // Output the data in the terminal
});
