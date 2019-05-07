const express = require("express");
const router = express.Router();

// University Model
const University = require("../../models/University");

// Routes
// GET api/universities -- Get all universities
router.get("/", (req, res) => {
  University.find()
    // Sort universities by name
    .sort({ name: 1 })
    .then(universities => {
      // Check if university is in the subscription period
      universities.map(university => {
        if (university.subscribedUntil < new Date()) {
          // Disable if not
          university.enabled = false;
        }
      });
      res.json(universities);
    });
});

// POST api/universities -- Create a university
router.post("/", (req, res, next) => {
  // Check if user already exists
  University.findOne({ name: req.body.name }).then(university => {
    if (university) {
      return res
        .status(400)
        .json({ affiliated: "University is already affiliated" });
    } else {
      const university = new University({
        name: req.body.name,
        countryCode: req.body.countryCode,
        website: req.body.website,
        address: req.body.address,
        foundingYear: req.body.foundingYear,
        motto: req.body.motto,
        description: req.body.description,
        firstCycleFees: req.body.firstCycleFees,
        secondCycleFees: req.body.secondCycleFees,
        subscribedUntil: req.body.subscribedUntil,
        enabled: req.body.enabled
      });

      university.save(err => {
        if (err) {
          return next(err);
        }
        res.send("University added successfully");
      });
    }
  });
});

// PUT api/universities/:id -- Modify an university
router.put("/:id", (req, res, next) => {
  University.findByIdAndUpdate(req.params.id, req.body, err => {
    if (err) {
      return next(err);
    }
    res.send("University updated");
  });
});

// DELETE api/universities/:id -- Delete an university
router.delete("/:id", (req, res, next) => {
  University.findByIdAndRemove(req.params.id, err => {
    if (err) {
      return next(err);
    }
    res.send("Deleted successfully");
  });
});

module.exports = router;
