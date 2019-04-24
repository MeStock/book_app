-- id authoer titile isbn image_url desription bookshelf

DROP TABLE IF EXISTS books;


CREATE TABLE books (
id SERIAL PRIMARY KEY,
title VARCHAR(255),
author VARCHAR(255),
description VARCHAR(255),
isbn VARCHAR(255),
image_url VARCHAR(255),
bookshelf VARCHAR(255)
);
INSERT INTO books (title, author, description, isbn, image_url, bookshelf) VALUES( 'Harry', 'rowling', 'wizard', 'sbn', 'image', 'bookshelf');
INSERT INTO books (title, author, description, isbn, image_url, bookshelf) VALUES( 'Harry', 'rowling', 'wizard', 'sbn', 'image', 'bookshelf');
