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


app.get('*',(request, response)=>{
  response.render('pages/index.ejs', {root:'./views'});
  
})
//----------------GLOBAL CONSTANTS-------------------------


//--------------CONSTRUCTOR FUNCTION-----------------------

function BookConstructor(title, author, description){
  this.title = title;
  this.author = author;
  this.description = description;
}

app.post('/searches', (request, response) => {
  // response.send(console.log(request.body.search[0]));
  const URL = `https://www.googleapis.com/books/v1/volumes?q=+intitle:${request.body.search[0]}`;
  superagent.get(URL).then(result => {
    let bookReturn = result.body.items;
    let tenBooks = bookReturn.map(bookArray => {
      let bookData = result.body.items[0].volumeInfo;
      let bookObj = new BookConstructor(bookData.title, bookData.authors[0], bookData.description);
      return bookObj;
    });
    // console.log(tenBooks);
    response.render('pages/searches/show.ejs');
  });
})



app.listen(PORT, () => console.log(`app is up on port ${PORT}`));