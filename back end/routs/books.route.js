const router = require('express').Router();
const Book = require('../models/books.model');

router.post('/addbook', (req, res) => {
  const newBook = new Book({
    name: req.body.name,
    imgUrl: req.body.imgUrl,
    info: req.body.info,
    price: req.body.price,
    department: req.body.department
  });

  newBook.save().then(book => {
    res.json(book);
  });
});

router.get('/getbooks', async (req, res) => {
  const books = await Book.find().populate('department');
  res.json(books);
});

module.exports = router;