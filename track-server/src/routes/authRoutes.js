const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const router = express.Router();
const jwt = require('jsonwebtoken');
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, 'MY_AWS');
    res.send({ token });
  } catch (err) {
    console.log('Kya error mila hai?');
    return res.status(422).send(err.message);
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .send({ error: 'Must provide username and password' });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: 'user not found' });
  }
  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, 'MY_AWS');
    res.send({ token });
  } catch (err) {
    console.log(err);
    return res.status(422).send({ error: 'Wrong password' });
  }
});

module.exports = router;
