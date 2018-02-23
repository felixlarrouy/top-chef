import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import data from './restaurant_lafourchette.json';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Find the best deals for French starred restaurants</h1>
        </header>

        <ul>
        {
          data.map(function(restaurant){
            var promotions = ""
            let num_promo = Object.keys(restaurant.promotions).length
            for (var i = 0; i < num_promo - 1; i++) {
              promotions += restaurant.promotions[i].title + ", "
            }
            promotions += restaurant.promotions[num_promo - 1].title
            return (
              <li>{restaurant.name} # {promotions}</li>
            );
          })
        }
        </ul>
      </div>
    );
  }
}

export default App;
