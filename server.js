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
app.use(express.urlencoded({extended:true}));
app.set('view-engine', 'ejs');



app.get('/', addToDB );



app.get('/new', (request,response)=>{
response.render('pages/searches/new.ejs');
})
app.get('*',(request, response)=>{
  response.render('pages/index.ejs', {root:'./views'});
})

app.post('/searches', getData);

//app.post('/', addToDB);

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

  
function getData(request, response){
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
  
    response.render('pages/searches/show.ejs', {tenBooks});
  });
}

function addToDB(request,response){
  
  client.query('SELECT * FROM books;').then(result =>{
  console.log(result.rows);
  response.render('pages/index.ejs', {tenBooks: result.rows});
  })

}
function frontPageDisplay(request,response){
  console.log(request.body)
  response.render('pages/index.ejs',{});




}
app.listen(PORT, () => console.log(`app is up on port ${PORT}`));