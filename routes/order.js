const express = require('express');
const router = express.Router();
const { stock, customers } = require('../data/promo');

// GET Order Route
router.get('/order-confirmation', (req, res) => {
  res.render('../views/pages/confirmationPage', {
    title: 'Thank You',
    orderId: Date.now().toString()
  });
});

// POST Order Route
router.post('/order', (req, res) => {
  if (canOrder(req.body, res)) {
    res.send({ status: 'success' });
    updateInventory(req.body);

    customers.push({
      givenName: req.body.givenName,
      surname: req.body.surname,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      province: req.body.province,
      postcode: req.body.postcode,
      country: req.body.country
    });
  }
});

// All Functions related to the routes
const canOrder = (user, res) => {
  let can = true;
  if (userExists(user)) {
    can = false;
    res.send({ status: 'error', error: '550' });
  } else if (!isGoodAdress(user)) {
    can = false;
    res.send({ status: 'error', error: '650' });
  } else if (!hasOrdered(user)) {
    can = false;
    res.send({ status: 'error', error: '000' });
  } else if (!inEnventory(user)) {
    can = false;
    res.send({ status: 'error', error: '450' });
  }
  return can;
};

const userExists = user => {
  return customers.some(
    customer =>
      (customer.surname === user.surname &&
        customer.givenName === user.givenName) ||
      customer.address === user.address
  );
};

const isGoodAdress = user => {
  return user.country.toLowerCase() == 'canada';
};

const hasOrdered = user => {
  if (user.order !== 'undefined' && user.order !== 'shirt') return true;
  if (user.order !== 'undefined' && user.size !== 'undefined') return true;
  return false;
};

const inEnventory = user => {
  let isInEnventory;
  switch (user.order) {
    case 'shirt':
      isInEnventory = Object.entries(stock.shirt).some(shirtArray => {
        return shirtArray[0] === user.size && shirtArray[1] > 0;
      });
      break;
    case 'socks':
      isInEnventory = stock.socks > 0;
      break;
    case 'bottle':
      isInEnventory = stock.bottle > 0;
      break;
  }
  return isInEnventory;
};

const updateInventory = user => {
  switch (user.order) {
    case 'shirt':
      let currentSize = null;
      let a = Object.entries(stock.shirt).filter(shirtArray => {
        if (shirtArray[0] === user.size) {
          currentSize = user.size;
          return shirtArray;
        }
      });

      // Update the number of shirt in each size
      if (currentSize === 'small')
        stock.shirt.small = (parseInt(stock.shirt.small) - 1).toString();
      if (currentSize === 'medium')
        stock.shirt.medium = (parseInt(stock.shirt.medium) - 1).toString();
      if (currentSize === 'large')
        stock.shirt.large = (parseInt(stock.shirt.large) - 1).toString();
      if (currentSize === 'xlarge')
        stock.shirt.xlarge = (parseInt(stock.shirt.xlarge) - 1).toString();
      break;

    case 'socks':
      stock.socks = (parseInt(stock.socks) - 1).toString();
      break;
    case 'bottle':
      stock.bottle = (parseInt(stock.bottle) - 1).toString();
      break;
  }
};

module.exports = router;