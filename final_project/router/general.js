const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message:`User ${username} registered`});
        }
        else {
            return res.status(400).json({message:`User ${username} already registered`});
        }
    }
    else {
        return res.status(404).json({message: "Must provide username and password"});
    }
});

function getBooks() {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    getBooks().then((bks) => res.send(JSON.stringify(bks)));
});

function getByISBN(isbn) {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({status:404, message:`ISBN ${isbn} not found`});
        }
    })
}

public_users.get('/books',function (req, res) {
    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });
        });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    getByISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getByISBN(req.params.isbn)
  .then(
      result => res.send(result.reviews),
      error => res.status(error.status).json({message: error.message})
  );
});


public_users.get('/books/isbn/:isbn',function (req, res) {
	const isbn = req.params.isbn;
	const get_books_isbn = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify(books[isbn], null, 4)));
      });
        });

public_users.get('/books/author/:author',function (req, res) {
	const author = req.params.author;
	 for (var i = 1; i < 11; i++) {if (author==books[i]["author"]) {isbn=i;}}
	 const get_books_author = new Promise((resolve, reject) => {
         resolve(res.send(JSON.stringify(books[isbn], null, 4)));
        });
        });


public_users.get('/books/title/:title',function (req, res) {
  ///Write your code here
    const title = req.params.title;
    for (var i = 1; i < 11; i++) {if (title==books[i]["title"]) {isbn=i;}}
    const get_books_title = new Promise((resolve, reject) => {
         resolve(res.send(JSON.stringify(books[isbn], null, 4)));
        });
        });     

module.exports.general = public_users;