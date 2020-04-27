'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

const PORT = process.env.PORT || 8000;

const Todos = require('./routes/todos');
const Orders = require('./routes/order');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use('/', Todos);
app.use('/', Orders);

// 404 Error Route
app.get('*', (req, res) => {
    res.status(404);
    res.render('pages/errorPage', {
    title: '404 PAGE NOT FOUND!'
    });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));