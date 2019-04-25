-- id authoer titile isbn image_url desription bookshelf

DROP TABLE IF EXISTS books;


CREATE TABLE books (
id SERIAL PRIMARY KEY,
title VARCHAR(255),
author VARCHAR(255),
description VARCHAR(1020),
-- isbn VARCHAR(255),
image_url VARCHAR(255),
bookshelf VARCHAR(255)
);
INSERT INTO books (title, author, description, image_url, bookshelf) VALUES( 'Harry', 'rowling', 'wizard', 'image', 'bookshelf');
INSERT INTO books (title, author, description, image_url, bookshelf) VALUES( 'Harry', 'rowling', 'wizard', 'image', 'bookshelf');
