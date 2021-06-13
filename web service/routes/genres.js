const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const express = require('express');
const { Genre, validate } = require('../models/Genre');

const router = express.Router();

router.get('/', async function (req, res) {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.find({ name: req.body.name });
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

router.post('/', auth, async (req, res) => {
  console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({
    name: req.body.name,
  });
  try {
    genre = await genre.save();
    res.send(genre);
  } catch (ex) {
    res.send(ex.message);

    // let error as MongoErrorProtocol {
    //   print("Driver error!")
    //   switch error.self {
    //   case let runtimeError as MongoRuntimeError:
    //       // handle RuntimeError
    //   case let serverError as MongoServerError:
    //       // handle ServerError
    //   case let userError as MongoUserError:
    //       // handle UserError
    //   default:
    //       // should never get here
    //   }
  }
});

router.put('/:id', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, {
    $set: { name: req.body.name },
  });
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove({ _id: req.params.id });
  if (!genre)
    return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

module.exports = router;
