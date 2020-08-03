const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Joi = require("joi");
const { Customer } = require("./customer");
const { Movie } = require("./movies");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 45,
      },
      isGold: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: Number,
        required: true,
      },
    }),
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 3,
        max: 20,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 0,
  },
});

const Rental = new mongoose.model("Rental", rentalSchema);

router.get("/", async (req, res) => {
  const rentals = await Rental.find().populate("customer movie");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id).populate(
    "customer movie"
  );
  if (!rental) {
    res.status(404).send("resourse not found");
    return;
  }
  res.send(rental);
});

router.post("/", async (req, res) => {
  validation(req, res);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    res.status(404).send("resourse not found");
    return;
  }

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) {
    res.status(404).send("resourse not found");
    return;
  }

  if (movie.numberInStock === 0) {
    res.status(400).send("movie out of stock");
    return;
  }

  const new_rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      isGold: customer.isGold,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      name: movie.name,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  const result = await new_rental.save();
  movie.numberInStock--;
  movie.save();

  res.send(result);
});
function validation(req, res) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send("bad input");
    return;
  }
}

module.exports = router;
