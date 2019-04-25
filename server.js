'use strict';

require('dotenv').config();
const express = require('express');
const superagent = require ('superagent');
const app = express();
const pg = require('pg');

const PORT = process.env.PORT || 3000;

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();


app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}));
app.set('view-engine', 'ejs');


app.get('/', displayDataFromDB);

app.get('/new', newSearch);
app.post('/searches', getData);

//TODO: SEE FEATURE TWO (LAB 12)
app.get('/books/:id', viewDetail);

app.post('/saved_books', addBooksToDB);

app.get('*',displayDataFromDB);

//app.post('/', addToDB);

//----------------GLOBAL CONSTANTS-------------------------

//---------------------------------------------------------
//--------------CONSTRUCTOR FUNCTION-----------------------
//---------------------------------------------------------

function BookConstructor(bookObj){
  this.title = bookObj.volumeInfo.title;
  this.authors = bookObj.volumeInfo.authors;
  this.description = bookObj.volumeInfo.description;
  this.isbn = bookObj.volumeInfo.industryIdentifiers ? bookObj.volumeInfo.industryIdentifiers[0].identifier : 'No isbn available.';
  this.image_url = bookObj.volumeInfo.imageLinks ? bookObj.volumeInfo.imageLinks.thumbnail.replace('http:', 'https:') : 'noimage.jpeg';
  this.bookshelf = 'TBD';
}

//---------------------------------------------------------
//--------------------OTHER FUNCTIONS-----------------------
//----------------------------------------------------------

function getData(request, response){
  const URL = `https://www.googleapis.com/books/v1/volumes?q=+title:${request.body.search[0]}`;
  superagent.get(URL).then(result => {
    if(result.body.totalItems === 0) {
      response.status(500).send('Sorry, something went wrong');
      return;
    }
    let bookReturn = result.body.items;
    let tenBooks = bookReturn.map(bookArray => {
      return new BookConstructor(bookArray);
    });
    response.render('pages/searches/show.ejs', {tenBooks});
  });
}

function displayDataFromDB(request,response){
  client.query('SELECT * FROM books;').then(result =>{
    response.render('pages/index.ejs', {tenBooks: result.rows});
  })
}

function newSearch(request, response){
  response.render('pages/searches/new.ejs');
}

function addBooksToDB(request, response){
  const {title, author, description, isbn, image_url, bookshelf } = request.body;
  client.query('INSERT INTO books(title, author, description, isbn, image_url, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);', [title, author, description, isbn, image_url, bookshelf]).then(() => {
    response.redirect('/');
  })
}

function viewDetail(request, response){
  client.query('SELECT * FROM books WHERE id=$1;', [request.params.id]).then(result => {
    response.render('pages/books/detail.ejs', {result: result.rows[0]});
  });
}

app.listen(PORT, () => console.log(`app is up on port ${PORT}`));
