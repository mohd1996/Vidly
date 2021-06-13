const express = require('express');
const { Movie, validate } = require('../models/Movie');
const { Genre } = require('../models/Genre');

const router = express.Router();

router.get('/', async function (req, res) {
  const movies = await Movie.find().sort('title');
  res.send(movies);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.find({ title: req.body.title });
  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');
  res.send(movie);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre');

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  try {
    await movie.save();
    res.send(movie);
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

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(req.params.id, {
    $set: {
      // title: req.body.title,
      // genre: req.body.genre,
      // numberInStock: req.body.numberInStock,
      // dailyRentalRate: req.body.dailyRentalRate,
      ...req.body,
    },
  });
  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');
  res.send(movie);
});

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove({ _id: req.params.id });
  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');
  res.send(movie);
});

module.exports = router;
