const router = require('express').Router();
const Carousel = require('../models/carousel.model');
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
});

const upload = multer({ storage: storage })

router.post('/addcarousel', upload.single('carouselImg'), async (req, res) => {
  try {
    const imgPath = `${req.protocol}://${req.get('host')}/assets/carouselImg/${req.file.filename}`
    const newCarousel = new Carousel({
      title: req.body.title,
      content: req.body.content,
      img: imgPath
    });

    await newCarousel.save();
    res.status(200).json(newCarousel);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/getcarousel', async (req, res) => {
  try {
    const gallery = await Carousel.find();
    res.status(200).json(gallery);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/deletecarousel/:id', async (req, res) => {
  try {
    await Carousel.deleteOne({_id: req.params.id})
    res.status(200).json('deleted successfully')
  } catch (err) {
    res.status(400).json(err)
  }
})

module.exports = router;