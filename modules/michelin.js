const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');

fs.readFile('./restaurant_global.txt', 'utf8', function(err, data) {
  if (err) throw err;
  console.log(data);
});

// var restaurant = {};
// restaurant['url'] = "https://restaurant.michelin.fr" + link.attr('href');
// fs.appendFileSync("restaurant_global.json", JSON.stringify(restaurant) + "\n", function(err) {
//   if (err) {
//     return console.log(err);
//   }
