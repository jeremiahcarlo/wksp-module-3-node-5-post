const express = require('express');
const Datastore = require('nedb');
const mongoose = require('mongoose');
const router = express.Router();

// Create Database items
const db = new Datastore({ filename: 'Database/items' });

// Load Database
db.loadDatabase();

// GET Route Todo
router.get('/todos', (req, res) => {
  db.find({}, (err, items) => {
    res.render('pages/todos', { title: 'Todo List', items });
  });
});

// POST Route Todo
router.post('/data', (req, res) => {
  const item = {
    _id: mongoose.Types.ObjectId().toString(),
    task: req.body.item
  };

  // check object not null
  if (item) {
    db.insert(item);
    res.redirect('/todos');
  }
});

// POST Route Delete Todo Item
router.post('/item/delete', (req, res) => {
  db.remove({ _id: req.body.id }, {});
  res.redirect('/todos');
});

module.exports = router;