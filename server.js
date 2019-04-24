'use strict';
require('dotenv').config();
const express = require('express');
const superagent = require ('superagent');
const app = express();

const PORT = process.env.PORT || 3000;

const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();


app.use(express.static('./public'));
// app.use('/styles',express.static('/public/styles'));
//finds the data
app.use(express.urlencoded({extended:true}));
app.set('view-engine', 'ejs');

app.get('/', (request, response) => {
  response.render('pages/index.ejs');
})


app.get('*',(request, response)=>{
  response.render('pages/index.ejs', {root:'./views'});
  
})


//----------------GLOBAL CONSTANTS-------------------------


//--------------CONSTRUCTOR FUNCTION-----------------------

function BookConstructor(bookObj){
  this.title = bookObj.title;
  this.authors = bookObj.author;
  this.description = bookObj.description;
  this.isbn = bookObj.industryIdentifiers[0].identifier;
  //this.image_url = bookObj.imageLinks.smallThumbnail;
  this.bookshelf = "test";
}

app.post('/searches', (request, response) => {
  // response.send(console.log(request.body.search[0]));
  const URL = `https://www.googleapis.com/books/v1/volumes?q=+title:${request.body.search[0]}`;
  superagent.get(URL).then(result => {
    if(result.body.totalItems === 0) {
      response.status(500).send('Sorry, something went wrong');
      return;
    }
    let bookReturn = result.body.items;
    let tenBooks = bookReturn.map((bookArray, idx) => {
      let bookData = result.body.items[idx].volumeInfo;
      let bookObj = new BookConstructor(bookData);
      //client.query('INSERT INTO books(title, author, description, isbn, image_url, bookshelf) VALUES ($1, $2, $3, $4, $5, $6)', [bookObj.title, bookObj.author, bookObj.description, bookObj.isbn, bookObj.image_url, bookObj.bookshelf ])
      return bookObj;
    });
    client.query('SELECT * FROM books;').then(result =>{
      response.render('pages/searches/show.ejs', {tenBooks: result.rows});


    })
    //response.render('pages/searches/show.ejs', {tenBooks});
  });
})




app.listen(PORT, () => console.log(`app is up on port ${PORT}`));