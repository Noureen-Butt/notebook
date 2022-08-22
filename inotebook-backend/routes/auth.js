const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const { body, validationResult } = require("express-validator");
const { findOne } = require("../models/User.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleWare/fetchuser.js");

const JWT_SECRET = "NothingSpecial";

// ROUTE 1:Create a user using: /api/auth/createUser No login required

router.post(
  "/createUser",
  [
    body("email", "Enter a valid email").isEmail(),
    // password must be at least 5 chars long
    body("name", "name should be of atleast 3 characters").isLength({ min: 3 }),
    body("password", "Password should be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // if there are any errors then return Bad status and and the error msg
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // const user = User(req.body)
    // user.save()
    try {
      //check if the email already exist
      let user = await User.findOne({ email: req.body.email });
      // if email already exist then return a bad status with error
      if (user) {
        return res
          .status(400)
          .json({ error: "The email you entered already exists" });
      }
      // creating new user
      const salt = await bcrypt.genSaltSync(10);
      const securePass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securePass,
      });
      const data = {
        user: {
          id: user._id,
        },
      };
      const AuthTocken = jwt.sign(data, JWT_SECRET);
      res.json({ AuthTocken });
    } catch (error) {
      console.error(error);
      res.status(500).json("Some error has occured!");
    }
  }
);

// ROUTE 2:Create a user using: /api/auth/loginUser No login required
router.post(
  "/loginUser",
  [
    body("email", "Enter a valid email").isEmail(),
    // password must be at least 5 chars long
    body("password", "Password should not be empty").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let success = false;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "incorrect email" });
      }
      const passCompare = await bcrypt.compare(password, user.password);
      if (!passCompare) {
        return res.status(400).json({ success, error: "incorrect password" });
      }
      const data = {
        user: {
          id: user._id,
        },
      };
      const AuthTocken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, AuthTocken });
    } catch (error) {
      console.error(error);
      res.status(500).json("Server error occured!");
    }
  }
);

// ROUTE 3: Create a user using: /api/auth/getuser  login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).json("Some error has occured!");
  }
});

module.exports = router;
