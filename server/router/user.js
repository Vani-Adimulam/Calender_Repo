const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../modal/User");
const router = express.Router();
const dns = require("dns");
const authMiddleware = require("../config/authMiddleware")
require('dotenv').config();




// Signup route
router.post(
  "/signup",
  [
    check("username", "Please Enter a Valid Username").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
    check("isSuperUser", "Invalid value for isSuperUser").optional().isBoolean(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { username, email, password, isSuperUser } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists",
        });
      }

      // Check if the email domain exists and is authorized
      const [localPart, domain] = email.split("@");
      dns.resolveMx(domain, async (err, addresses) => {
        if (err || !addresses || addresses.length === 0) {
          return res.status(400).json({
            msg: "Invalid or unauthorized email domain",
          });
        }

        // Continue with the user registration
        user = new User({
          username,
          email,
          password,
          isSuperUser: isSuperUser || false, // Set isSuperUser flag based on request body
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
          user: {
            id: user.id,
            isSuperUser: user.isSuperUser,
          },
        };

        jwt.sign(
          payload,
          "randomString",
          {
            expiresIn: 10000,
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              token,
            });
          }
        );
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Please enter a valid password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({
          msg: "User Not Registered",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          msg: "Incorrect Password",
        });
      }

      const payload = {
        user: {
          id: user.id,
          isSuperUser: user.isSuperUser,
        },
      };

      let token;
      if (user.isSuperUser) {
        token = jwt.sign(
          payload,
          process.env.JWT_SUPERUSER_SECRET,
          {
            expiresIn: 3600,
          }
        );
      } else {
        token = jwt.sign(
          payload,
          process.env.JWT_USER_SECRET,
          {
            expiresIn: 3600,
          }
        );
      }

      res.status(200).json({
        token,
        user,
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// Get all users
router.get("/getusers", authMiddleware, async (req, res) => {
  try {
    const allUsers = await User.find();
    console.log(allUsers);
    res.send(allUsers);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// Get user by ID
router.get("/getusers/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }
    res.send(user);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;




