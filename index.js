var michelin = require("./modules/michelin.js")
var lafourchetteLinkScrapper = require("./lafourchette_link_scrapper.js")
var lafourchette = require("./modules/lafourchette.js")

var date = new Date()
var day = date.getDate()
var month = date.getMonth()

michelin.getMichelinRestaurants();
lafourchetteLinkScrapper.findLafourchetteRestaurants();
lafourchette.findPromotions();

// Scrape michelin only once a year because the starred restaurants only change once a year
// Stars attribution is usually mid February
if(day == 20 && month == 1) {
  console.log("scrapping michelin")
  michelin.getMichelinRestaurants();
} else {
  console.log("no need to scrap michelin at this time of the year");
}

// Scape lafourchette restaurants once a day
var minutes = 60 * 24, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("Looking for french starred restaurants on lafourchette");
  lafourchetteLinkScrapper.findLafourchetteRestaurants();
}, the_interval);

// Scrape promotions every six hours
var minutes = 60 * 6, the_interval = minutes * 60 * 1000;
setInterval(function() {
  console.log("Looking for promotions");
  lafourchette.findPromotions();
}, the_interval);
