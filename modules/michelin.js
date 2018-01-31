const cheerio = require('cheerio')
const request = require("request");

request({
  uri: "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin",
}, function(error, response, body) {
    var $ = cheerio.load(body)

    var restaurantList = [];
    $('.poi-card-link').each(function(index, element){
    	restaurantList[index] = {};
      var link = $(this)
    	restaurantList[index]['url'] = link.attr('href');
      var title = restaurantList[index]['title'] = $(link).find('.poi_card-display-title').text();
      console.log("--" + title + "--")
    	restaurantList[index]['title'] = $(link).find('.poi_card-display-title').text();
    });
    //console.log(restaurantList); // Output the data in the terminal
});
