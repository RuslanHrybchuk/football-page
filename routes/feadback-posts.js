const express = require('express');
const router = express.Router();
const Feadback = require('../modules/feadback');

router.get('/', async (req, res) => {
  try {
    const feadbacks = await Feadback.find();
    res.json(feadbacks);
  } catch {
    res.json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const feadback = new Feadback({
    'first-name': req.body['first-name'],
    'last-name': req.body['last-name'],
    email: req.body.email,
    feadbacks: req.body.feadbacks
  });
  try {
    const savedFeadback = await feadback.save();
    res.json(savedFeadback);
  } catch {
    res.json({ message: err.message });
  }
});

module.exports = router;
