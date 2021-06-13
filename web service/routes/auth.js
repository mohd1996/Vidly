const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const express = require('express');
const { User, validateRegister, validateLogin } = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  // Joi validation
  const { error } = validateRegister(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // DB validation
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(404).send('This email is already registered');

  user = new User(
    { ...req.body }
    // _.pick(req.body, ['name', 'email', 'password'])
  );

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(user.password, salt);

  user.password = hashed;

  await user.save();

  const token = user.generateJWT();

  res.header('X-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

router.post('/login', async (req, res) => {
  // Joi validation
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // DB validation
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = user.generateJWT();

  res.send(token);
});

router.get('/myprofile', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});
module.exports = router;
