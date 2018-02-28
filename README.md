# TOP CHEF

> Eat well and cheaper than usually

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Introduction

Each year, Michelin publish the Michelin Red Guide which awards Michelin stars to some restaurants.

The criteria for the stars are:

1. Michelin star **"A very good restaurant in its category"** (Une très bonne table dans sa catégorie)
2. Michelin stars: **"Excellent cooking, worth a detour"** (Table excellente, mérite un détour)
3. Michelin stars: **"Exceptional cuisine, worth a special journey"** (Une des meilleures tables, vaut le voyage)

Ther average price for a starred restaurant could start from 50€ up to more than 400€.

Thanks the [LaFourchette](https://www.lafourchette.com), you can book a restaurant at the best price and get exclusive offers and discount up to 50%.

![michelin](./img/michelin.png)

![lafourchette](./img/lafourchette.png)

## Objective - Workshop in 1 sentence

**Get the current deal for a French Michelin starred restaurants.**

## How to do that?

By creating a link between [restaurant.michelin.fr](https://restaurant.michelin.fr/), [lafourchette.com](https://www.lafourchette.com) and the end-user.

## What you need to do to get the promotions for french starred restaurants:

First you need to install some packages:

```sh
❯ npm install cheerio request fs
```

Once you have clone the repository, go to that repository and execute the following command:

```sh
❯ cd modules/ && node michelin.js
```

Then, to find the starred restaurants on [lafourchette.com](https://www.lafourchette.com), execute the following command:

```sh
❯ cd .. && node lafourchette_restaurant_scrapper.js
```

Finally, to find the deals, execute the following command:

```sh
❯ cd modules/ && node lafourchette.js
```

Note: You need to replace the last comma at the end of the document lafourchette_promotions.json located in docs/react-app/src by a "]".

You can launch the web app with the following command:
```sh
❯ cd ../docs/react-app && npm install && npm install --save reactstrap@next react react-dom && npm start
```
