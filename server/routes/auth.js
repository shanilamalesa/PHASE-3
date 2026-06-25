const express = require("express");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

const router = express.Router();

router.post("/login", (req, res) => {
  const user = {
    id: 1,
    email: "admin@test.com",
  };

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    env.jwtSecret,
    {
      expiresIn: "7d",
    }
  );

  res.json({ token });
});

module.exports = router;