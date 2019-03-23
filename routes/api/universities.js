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
    .then(universities => res.json(universities));
});

// POST api/universities -- Create a university
router.post("/", (req, res, next) => {
  // Check if user already exists
  University.findOne({ name: req.body.name }).then(university => {
    if (university) {
      return res.status(400).json({ university: "University is already affiliated" });
    } else {
      const university = new University({
        name: req.body.name,
        country_code: req.body.country_code,
        foundingYear: req.body.foundingYear,
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
