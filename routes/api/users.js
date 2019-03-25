const express = require("express");
const router = express.Router();

// User Model
const User = require("../../models/User");

const bcrypt = require("bcryptjs");
const keys = require("../../config/keys");
const jwt = require("jsonwebtoken");

const validator = require("validator");
const isEmpty = require("is-empty");

// Register validation
function validateRegistration(input) {
  let errors = {};

  // Convert empty fields to empty string so validator functions work
  input.name = !isEmpty(input.name) ? input.name : "";
  input.email = !isEmpty(input.email) ? input.email : "";
  input.password = !isEmpty(input.password) ? input.password : "";
  input.passwordConfirm = !isEmpty(input.passwordConfirm)
    ? input.passwordConfirm
    : "";

  // Check name
  if (validator.isEmpty(input.name)) {
    errors.name = "Name field is required";
  }

  // Check email
  if (validator.isEmpty(input.email)) {
    errors.email = "Email field is required";
  } else if (!validator.isEmail(input.email)) {
    errors.email = "Email is invalid";
  }

  // Check password
  if (validator.isEmpty(input.password)) {
    errors.password = "Password field is required";
  }

  // Check confirm password
  if (validator.isEmpty(input.passwordConfirm)) {
    errors.passwordConfirm = "Confirm password field is required";
  } else if (!validator.equals(input.password, input.passwordConfirm)) {
    errors.passwordConfirm = "Passwords do not match";
  } else if (!validator.isLength(input.password, { min: 5, max: 35 })) {
    errors.password = "Password must be at least 5 characters long";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

// Login validation
function validateLogin(input) {
  let errors = {};

  // Convert empty fields to empty string so validator functions work
  input.email = !isEmpty(input.email) ? input.email : "";
  input.password = !isEmpty(input.password) ? input.password : "";

  // Check email
  if (validator.isEmpty(input.email)) {
    errors.email = "Email field is required";
  } else if (!validator.isEmail(input.email)) {
    errors.email = "Email is invalid";
  }

  // Check password
  if (validator.isEmpty(input.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

// Routes
// GET api/users -- Get all users
router.get("/", (req, res) => {
  User.find().then(users => res.json(users));
});

// POST api/users/register -- Register user
router.post("/register", (req, res) => {
  // Form validation
  const { errors, isValid } = validateRegistration(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Check if user already exists
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email address is already in use" });
    } else {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        university: req.body.university,
        role: req.body.role
      });

      // Hash password and save user in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          user.password = hash;
          user
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// POST api/users/login -- Login user and return JWT token
router.post("/login", (req, res) => {
  // Form validation
  const { errors, isValid } = validateLogin(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailNotFound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          role: user.role
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: "7d" // 7 days
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ incorrectPassword: "Password is not correct" });
      }
    });
  });
});

// PUT api/users/:id -- Modify an user
router.put("/:id", (req, res, next) => {
  User.findByIdAndUpdate(req.params.id, req.body, err => {
    if (err) {
      return next(err);
    }
    res.send("User updated");
  });
});


// DELETE api/users/:id -- Delete an user
router.delete("/:id", (req, res, next) => {
  User.findByIdAndRemove(req.params.id, err => {
    if (err) {
      return next(err);
    }
    res.send("Deleted successfully");
  });
});

module.exports = router;
