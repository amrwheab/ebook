const router = require('express').Router();
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  
  const userFound = await User.findOne({email: req.body.email});
  if (userFound) {
    return res.status(400).json('user is exist')
  }

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    address: req.body.address
  });

  newUser.save().then(user => {
    const token = jwt.sign({id: user._id}, process.env.JWTSECRET);
    res.status(200).json({token, user});
  }).catch(err => {
    res.status(400).json(err.message);
  });
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (user) {
      const validatePass = bcrypt.compareSync(req.body.password, user.password);
      if (validatePass) {
        const token = jwt.sign({id: user._id}, process.env.JWTSECRET);
        res.status(200).json({token, user});
      } else {
        res.status(401).json('wrong password')
      }
    } else {
      res.status(401).json('email doesn\'t exist')
    }
  } catch (err) {
    res.status(401).json(err.message)
  }
});

router.put('/addnewbook/:token', (req, res) => {
  const id = jwt.decode(req.params.token).id;
  if (id) {
    User.updateOne({_id: id}, {$push: {buyedBooks: req.query.bookId}}, { new: true }).then(() => {
      res.status(200).json('added book');
    }).catch(err => {
      res.status(400).json(err.message);
    });
  } else {
    res.status(400).json('you must be signed for this step');
  }
});

module.exports = router;