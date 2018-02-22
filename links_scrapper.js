const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');

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
}).on('error', function(err) {
  console.log(err)
}).end();

/*const frenchStarredRestaurantsUrl = "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin"
var numberOfPages = -1
exports.getMichelinRestaurants = (callback) => {
  getNumberOfPages(frenchStarredRestaurantsUrl).then(nPages => {
    const promises = []
    for (var i = 1; i <= nPages; i++) {
      promises.push(getRestaurantsUrls(i))
    }
    return Promise.all(promises)
  }).then(restaurantLinks => {
    const promises = []
    for (var i = 0; i < restaurantLinks.length; i++) {
      promises.push(getRestaurantsInfos(restaurantLinks[i]))
    }
    return Promise.all(promises)
  }).then(restaurants => {
    return saveToJSON(restaurants)
  }).then(string => {
    callback(null, string)
  }).catch(err => {
    callback(err)
  })
}
function getNumberOfPages(url) {
  return new Promise(function(resolve, reject) {
    request({
      uri: "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin",
    }, function(err, resp, body) {
      if (err) reject(error)
      const $ = cheerio.load(body);
      $(".mr-pager-link").each(function() {
        if (numberOfPages < parseInt($(this).attr("attr-page-number"))) {
          numberOfPages = parseInt($(this).attr("attr-page-number"))
        }
      })
      if (numberOfPages == -1) {
        resolve(numberOfPages)
      } else {
        reject(new Error("Can't find the number of pages."))
      }
    })
  })
}
function getRestaurantsUrls(pageNumber) {
  return new Promise(function(resolve, reject) {
    request({
      uri: frenchStarredRestaurantsUrl + "/page-" + pageNumber,
    }, function(err, resp, body) {
      if (err) reject(error)
      const $ = cheerio.load(body)
      var links = []
      $('.poi-card-link').each(function(index) {
        links.push("https://restaurant.michelin.fr" + $(this).attr('href'));
      })
      resolve(links)
    })
  })
}
function getRestaurantsInfos(url) {
  return new Promise(function(resolve, reject) {
    request({
      uri: url,
    }, function(err, resp, body) {
      if (err) reject(error)
      const $ = cheerio.load(body)
      var restaurant = {}
      restaurant.name = $('.poi_intro-display-title').text().trim();
      restaurant.address = {};
      restaurant.address.thoroughfare = $('.poi_intro-display-address .field__items .thoroughfare').text();
      restaurant.address.postalcode = $('.poi_intro-display-address .field__items .postal-code').text();
      restaurant.address.locality = $('.poi_intro-display-address .field__items .locality').text();
      if (restaurant != {}) {
        resolve(restaurant)
      } else {
        reject("Cannot find restaurant")
      }
    })
  })
}
function saveToJSON(restaurantList) {
  return new Promise(function(resolve, reject) {
    for (var i = 0; i < restaurantList.length; i++) {
      try {
        fs.appendFile("restaurant.json", restaurantList[i] + "\n");
      } catch (err) {
        console.log(err);
      }
    }
  })
}*/
