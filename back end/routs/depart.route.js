const router = require('express').Router();
const Department = require('../models/depart.model');

router.post('/newdepart', (req, res) => {
  const newDepart = new Department({
    name: req.body.departName,
  });

  newDepart.save().then(depart => {
    res.status(200).json(depart);
  }).catch(err => {
    res.status(400).json(err.message);
  });
});

router.get('/getdeparts', async (req, res) => {
  try {
    const departs = await Department.find();
    res.status(200).json(departs);
  } catch (err) {
    res.status(400).json(err.message)
  }
});

router.delete('/deletedepart/:id', (req, res) => {
  try {
    Department.remove({_id: req.params.id}, (err) => {
      if (err) {
        res.status(400).json(err.message)
      } else {
        res.status(200).json('removed successfully')
      }
    })
  } catch (err) {
    res.status(400).json(err.message)
  }
});

module.exports = router;