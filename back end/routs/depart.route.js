const router = require('express').Router();
const Department = require('../models/depart.model');

router.post('/newdepart', (req, res) => {
  const newDepart = new Department({
    name: req.body.departName,
  });

  newDepart.save().then(depart => {
    res.json(depart);
  });
});

router.get('/getdeparts', async (req, res) => {
  const departs = await Department.find();
  res.json(departs);
});

module.exports = router;