const cheerio = require('cheerio')
const request = require('request');
const fs = require('fs');

var separators = ['\'', ' - ', ' '];
var regExp = new RegExp('[' + separators.join('') + ']', 'g')

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('./restaurant_info.json')
});

lineReader.on('line', function(line) {
  var restaurant = JSON.parse(line);
  var tokens = restaurant["name"].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").split(regExp);
  console.log(tokens);
});
