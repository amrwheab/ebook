const router = require('express').Router();
const Auther = require('../models/auther.model');
const Books = require('../models/books.model');
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

router.get('/getauthers', async (req, res) => {
  try {
    const authers = await Auther.find();
    res.status(200).json(authers);
  } catch (err) {
    res.status(400).json(err.message)
  }
});

router.get('/getauthersnames', async (req, res) => {
  try {
    const authers = await Auther.find().select('name');
    res.status(200).json(authers);
  } catch (err) {
    res.status(400).json(err.message)
  }
});

router.get('/getoneauther/:id', async (req, res) => {
  try {
    const auther = await Auther.findById(req.params.id);
    const books = await Books.find().select('auther').populate('auther');
    res.status(200).json({auther, books});
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.post('/addAuther', upload.single('autherImg'), async (req, res) => {
  let imgPath = undefined;
  if (req.file) {
    imgPath = `${req.protocol}://${req.get('host')}/assets/autherImg/${req.file.filename}`
  }

  try {
    if (!req.body.info) {
      req.body.info = undefined;
    }
    const newAuther = new Auther({
      name: req.body.name,
      info: req.body.info,
      imgUrl: imgPath
    });

    await newAuther.save();
    res.status(200).json(newAuther);
  } catch (err) {
    res.status(400).json(err.message)
  }
});

router.put('/updateauther', upload.single('autherImg'),async (req, res) => {
  try {
    let imgPath = undefined;
    if (req.file) {
      imgPath = `${req.protocol}://${req.get('host')}/assets/autherImg/${req.file.filename}`
    }
  
    if (imgPath) {
      await Auther.updateOne({_id: req.body.id}, {
        $set: {
          name: req.body.name,
          info: req.body.info,
          imgUrl: imgPath
        }});
        res.status(200).json(imgPath)
    } else {
      await Auther.updateOne({_id: req.body.id}, {
        $set: {
          name: req.body.name,
          info: req.body.info
        }});
        res.status(200).json('updated successfully')
    }
  } catch (err) {
    res.status(400).json(err.message)
  }
})

module.exports = router;