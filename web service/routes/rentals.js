const Fawn = require('fawn');
const express = require('express');
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/Rental');
const { Movie } = require('../models/Movie');
const { Customer } = require('../models/Customer');

Fawn.init(mongoose);

const router = express.Router();
router.get('/', async function (req, res) {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
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

  // if (!mongoose.Types.ObjectId.isValid(req.body.customerId))
  // return res.status(404).send('Invalid customer');
  //exclude _v using Rest/Spread operator
  const { _v, ...customer } = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer');

  const requestMovie = await Movie.findById(req.body.movieId);
  if (!requestMovie) return res.status(400).send('Invalid movie');
  if (!requestMovie.numberInStock === 0)
    return res.status(400).send('Movie out of stock');

  let rental = new Rental({
    customer: customer,
    movie: {
      _id: requestMovie._id,
      title: requestMovie.title,
      dailyRentalRate: requestMovie.dailyRentalRate,
    },
    dateReturned: req.body.dateReturned,
  });
  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update(
        'movies',
        { _id: requestMovie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send(ex.message);

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
