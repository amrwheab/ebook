const router = require('express').Router();
const Book = require('../models/books.model');
const multer = require('multer');
const path = require('path');
const Books = require('../models/books.model');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'assets', file.fieldname))
  },
  filename: function (req, file, cb) {

    let fileExtention = '';
    for (let i = file.originalname.length-1; i >= 0; i--) {
      if (file.originalname[i] === '.'){
        break
      }
      fileExtention += file.originalname[i]
    }

    cb(null, Date.now() + '.' + fileExtention.split('').reverse().join(''))
  }
})

const upload = multer({ storage: storage })

const cpUpload = upload.fields([{ name: 'pdffull', maxCount: 1 }, { name: 'img', maxCount: 1 }, { name: 'pdfmini', maxCount: 1 }])
router.post('/addbook', cpUpload, (req, res) => {

  const imgName = req.files['img'][0].filename;
  const imgPath = `${req.protocol}://${req.get('host')}/assets/img/${imgName}`;
  const pdffullName = req.files['pdffull'][0].filename;
  const pdffullPath = `${req.protocol}://${req.get('host')}/assets/pdffull/${pdffullName}`;
  const pdfminiName = req.files['pdfmini'][0].filename;
  const pdfminiPath = `${req.protocol}://${req.get('host')}/assets/pdfmini/${pdfminiName}`;

  const newBook = new Book({
    name: req.body.name,
    imgUrl: imgPath,
    info: req.body.info,
    price: req.body.price,
    department: req.body.department,
    miniPath: pdfminiPath,
    fullPath: pdffullPath,
    isFeatured: req.body.isFeatured
  });

  newBook.save().then(book => {
    res.json(book);
  }).catch(err => {
    res.status(400).json(err.message)
  });
});

router.get('/getallbooks', async (req, res) => {
  try {
    const books = await Book.find().populate('department');
    res.status(200).json(books);
  } catch (err) {
    res.status(400).json(err.message)
  }
});

router.get('/getbooks/:id', async (req, res) => {
  try {
    const books = await Book.find({department: req.params.id});
    res.status(200).json(books);
  } catch (err) {
    res.status(400).json(err.message)
  }
});

router.get('/getonebook/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('department');
    res.status(200).json(book);
  } catch (err) {
    res.status(400).json(err.message)
  }
});

router.get('/getbookscount', async (req, res) => {
  try {
    const books = await Book.find().countDocuments(count => count);
    res.status(200).json(books);
  } catch (err) {
    res.status(400).json(err.message)
  }
});

router.put('/updatebook', async (req, res) => {
  try {
    const book = await Book.findById(req.body.id);
    const availableupdates = ['name', 'imgUrl', 'info', 'price', 'department', 'miniPath', 'fullPath', 'isFeatured']

    for (let i = 0; i < availableupdates.length; i++) {
      if (req.body[availableupdates[i]]) {
        book[availableupdates[i]] = req.body[availableupdates[i]]
      }
    }

    book.save().then(book => {
      res.status(200).json(book)
    }).catch();
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.delete('/deletebook', async (req, res) => {
  try {
    await Book.deleteMany({_id: {$in: req.query.ids }});
    res.status(200).json('removed successfully');
  } catch (err) {
    res.status(400).json(err.message);
  }
});

module.exports = router;