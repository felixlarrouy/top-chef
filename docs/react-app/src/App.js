import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button, Row, Col } from 'reactstrap';
import logo from './logo.png';
import './App.css';
import data from './lafourchette_promotions.json';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Find the best deals for French starred restaurants</h1>
        </header>

        <div class="grid-container">
          <div className="grid-item">
            <ul>
            {
              data.map(function(restaurant){
                var promotions = ""
                let num_promo = Object.keys(restaurant.promotions).length
                for (var i = 0; i < num_promo - 1; i++) {
                  promotions += restaurant.promotions[i].title + "\n"
                }
                promotions += "\n" + restaurant.promotions[num_promo - 1].title
                return (
                  <Card className="cards">
                    <CardBody>
                      <CardTitle className="title">{restaurant.name}</CardTitle>
                      <CardSubtitle className="address">{restaurant.address.address_locality}, {restaurant.address.postal_code}</CardSubtitle>
                      <CardSubtitle className="stars">{restaurant.stars}</CardSubtitle>
                      <CardText className="promo">Promotion(s): {promotions}</CardText>
                      <Button href={restaurant.link}>See on Lafourchette.com</Button>
                    </CardBody>
                  </Card>
                );
              })
            }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
