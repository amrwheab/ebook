const router = require('express').Router();
const Book = require('../models/books.model');
const multer = require('multer');
const path = require('path');


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
    isFeatured: req.body.isFeatured,
    auther: req.body.auther
  });

  newBook.save().then(book => {
    res.json(book);
  }).catch(err => {
    res.status(400).json(err.message)
  });
});

router.get('/getallbooks', async (req, res) => {
  try {
    const books = await Book.find().populate('department').populate('auther');
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

router.put('/updatebook', cpUpload, async (req, res) => {

  let imgPath = '';
  if (req.files['img']) {
    const imgName = req.files['img'][0].filename;
    imgPath = `${req.protocol}://${req.get('host')}/assets/img/${imgName}`;
  }
  let pdffullPath = '';
  if (req.files['pdffull']) {
    const pdffullName = req.files['pdffull'][0].filename;
    pdffullPath = `${req.protocol}://${req.get('host')}/assets/pdffull/${pdffullName}`;
  }
  let pdfminiPath = '';
  if (req.files['pdfmini']) {
    const pdfminiName = req.files['pdfmini'][0].filename;
    pdfminiPath = `${req.protocol}://${req.get('host')}/assets/pdfmini/${pdfminiName}`;
  }

  try {
    const book = await Book.findById(req.body.id);
    const availableupdates = ['name', 'info', 'price', 'department', 'isFeatured', 'auther']

    for (let i = 0; i < availableupdates.length; i++) {
      if (req.body[availableupdates[i]]) {
        book[availableupdates[i]] = req.body[availableupdates[i]]
      }
    }

    if (imgPath) {
      book.imgUrl = imgPath;
    }
    if (pdffullPath) {
      book.fullPath = pdffullPath;
    }
    if (pdfminiPath) {
      book.miniPath = pdfminiPath;
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