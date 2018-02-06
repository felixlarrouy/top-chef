const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');

var num_pages = 0;

request({
  uri: "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin",
}, function(error, response, body) {
  var $ = cheerio.load(body);

  // if file exists, delete its content
  if (fs.existsSync('restaurant_links.txt')) {
    fs.truncate('restaurant_links.txt', 0, function() {
      console.log('done');
    })
  }

  $(".mr-pager-link").each(function() {
    var current = $(this);
    if (num_pages < parseInt(current.attr("attr-page-number"))) {
      num_pages = parseInt(current.attr("attr-page-number"));
    }
  });
  console.log("number of pages: " + num_pages);

  for (var i = 1; i <= num_pages; i++) {
    request({
      uri: "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/page-" + i,
    }, function(error, response, body) {
      var $ = cheerio.load(body);
      $('.poi-card-link').each(function(index) {
        var link = $(this);
        //restaurant['title'] = $(link).find('.poi_card-display-title').text().trim();
        var restaurant_link = "https://restaurant.michelin.fr" + link.attr('href');
        try {
          fs.appendFile("restaurant_links.txt", restaurant_link + "\n");
        } catch (err) {
          console.log(err);
        }
      });
    }).on('error', function(err) {
      console.log(err)
    }).end()
  }
});
