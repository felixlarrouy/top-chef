const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');

if (fs.existsSync('./michelin_restaurants.json')) {
  fs.truncate('michelin_restaurants.json', 0, function() {
  })
}

let num_pages = -1

request({
  uri: "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin",
}, function(error, response, body) {
  var $ = cheerio.load(body);

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
        let restaurant_link = "https://restaurant.michelin.fr" + link.attr('href');

        request({
          uri: restaurant_link,
        }, function(error, response, body) {
          if (error) return console.log(error);
          var $ = cheerio.load(body);
          var restaurant = {};
          restaurant['name'] = $('.poi_intro-display-title').text().trim();
          var thoroughfare = $('.poi_intro-display-address .field__items .thoroughfare').text();
          var postalcode = $('.poi_intro-display-address .field__items .postal-code').text();
          var locality = $('.poi_intro-display-address .field__items .locality').text();
          restaurant['stars'] = $('#node_poi-guide-wrapper > div.node_poi-distinction-section > ul > li:nth-child(1) > div.content-wrapper').text()
          var address = {}
          address['thoroughfare'] = thoroughfare
          address['postalcode'] = postalcode
          address['locality'] = locality
          restaurant['address'] = address
          var picture = $('#flexslider_views_slideshow_poi_image_slideshow-restaurant_slideshow > li.flexslider-views-slideshow-main-frame-row.flexslider_views_slideshow_slide.views-row-1.views-row-odd.flex-active-slide > div.views-field.views-field-field-image > div > img')
          restaurant['picture'] = picture.attr('src')
          try {
            fs.appendFile("michelin_restaurants.json", JSON.stringify(restaurant) + "\n");
          } catch (err) {
            console.log(err);
          }
        }).on('error', function(err) {
          console.log(err)
        }).end()
      });
    }).on('error', function(err) {
      console.log(err)
    }).end()
  }
}).on('error', function(err) {
  console.log(err)
}).end();
