'use strict';

const express = require('express');
const superagent = require ('superagent');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('/public'));
//finds the data
app.use(express.urlencoded({extended:true}));
app.set('view-engine', 'ejs');

app.get('/', (request, response) => {
  response.render('pages/index.ejs');
})














app.listen(PORT, () => console.log(`app is up on port ${PORT}`));