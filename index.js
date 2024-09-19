const express = require('express');
const router = require('./Router/router');
const path = require('path');
const mongoose = require('./config/mongose')
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use((req, res, next) => {
    res.cookie('name', 'Ronaldo');
    next(); 
});


app.use('/', router);


app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
