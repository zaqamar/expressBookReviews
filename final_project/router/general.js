const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    // return res.status(300).json({message: "Yet to be implemented"});
    if (isValid(req.body.username)) {
        return res.status(400).json({ message: "Error: Username already exists!" });
    }
    else {
        let user = {
            username: req.body.username,
            password: req.body.password
        }
        users.push(user);
        return res.status(200).json({ message: "Registration successful!" });
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    res.send(books[isbn])
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    let author = req.params.author;
    let arr = Object.entries(books)
    const book_author = new Promise((resolve, reject) => {

        let book_by_author = arr.filter((item) => item[1].author === author)
        if (book_by_author) {
            resolve(book_by_author)
            // res.status(200).json(book_by_author[0][1])
        }
        else {
            // res.status(404).json({message: `No Book is found for the author: ${author}`})
            reject({ message: `No Book is found for the author: ${author}` })
        }
    })

    book_author.then((resp) => {
        res.status(200).json(resp)
    }).catch(err => res.status(403).json({ error: err }))

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    let title = req.params.title;
    let arr = Object.entries(books)

    const book_title = new Promise((resolve, reject) => {
        let book_by_title = arr.filter((item) => item[1].title === title)
        if (book_by_title) {
            // res.status(200).json(book_by_title[0][1])
            resolve(book_by_title[0][1])
        }
        else {
            // res.status(404).json({message: `No Book is found for the title: ${title}`})
            reject({ message: `No Book is found for the title: ${title}` })
        }
    });

    book_title.then((resp) => {
        res.status(200).json(resp)
    }).catch(err => res.status(403).json({ error: err }))
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    //return res.status(300).json({ message: "Yet to be implemented" });
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews))
});

module.exports.general = public_users;
