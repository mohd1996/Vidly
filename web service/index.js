const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const genreRoute = require('./routes/genres');
const customRoute = require('./routes/customers');
const movieRoute = require('./routes/movies');
const rentalRoute = require('./routes/rentals');
const authRoute = require('./routes/auth');

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL Error: jwtPrivateKey is not defined');
  process.exit(1);
}

//? 1. Connect to DB
mongoose
  .connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected...'))
  .catch(err => console.log("Couldn't connect" + err));

const app = express();
app.use(express.json());
app.use(helmet());
app.use('/api/movies', movieRoute);
app.use('/api/genres', genreRoute);
app.use('/api/customers', customRoute);
app.use('/api/rentals', rentalRoute);
app.use('/api/auth', authRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

//* _id = 600a653828d42b5f24f2c9c2
//* MongoDB driver-generated ID

//* 12 bytes:
//*  4 bytes: timestamp
//*  3 bytes: machine identifier
//*  2 bytes: process identifier
//*  3 bytes: counter
