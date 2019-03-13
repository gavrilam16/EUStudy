const express = require("express");
const router = express.Router();

// Country Model
const Country = require("../../models/Country");

// Routes
// GET api/countries -- Get all countries
router.get("/", (req, res) => {
  Country.find()
    // Sort countries by names
    .sort({ name: 1 })
    .then(countries => res.json(countries));
});

// POST api/countries -- Create a country
router.post("/", (req, res, next) => {
  const country = new Country({
    name: req.body.name,
    euMember: req.body.euMember,
    firstCycleFees: req.body.firstCycleFees,
    secondCycleFees: req.body.secondCycleFees,
    payingFees: req.body.payingFees,
    needBasedGrants: req.body.needBasedGrants,
    meritBasedGrants: req.body.meritBasedGrants,
    receivingGrants: req.body.receivingGrants
  });

  country.save(err => {
    if (err) {
      return next(err);
    }
    res.send("Country added successfully");
  });
});

// PUT api/items/:id -- Modify a country
router.put("/:id", (req, res, next) => {
  Country.findByIdAndUpdate(req.params.id, req.body, err => {
    if (err) {
      return next(err);
    }
    res.send("Country updated");
  });
});

// DELETE api/items/:id -- Delete a country
router.delete("/:id", (req, res, next) => {
  Country.findByIdAndRemove(req.params.id, err => {
    if (err) {
      return next(err);
    }
    res.send("Deleted successfully");
  });
});

module.exports = router;
