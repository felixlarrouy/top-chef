import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
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

        <div className="restaurant">
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
                <Card>
                  <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180" alt="Card image cap" />
                  <CardBody>
                    <CardTitle>{restaurant.name}</CardTitle>
                    <CardSubtitle>Number of stars</CardSubtitle>
                    <CardText>{promotions}.</CardText>
                    <Button>Button</Button>
                  </CardBody>
                </Card>
              );
            })
          }
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
