const express = require("express");
const router = express.Router();
const { requireSignin, authMiddleware } = require("../controllers/authController");
const { read } = require("../controllers/userController");

// protected route
router.get('/profile', requireSignin, authMiddleware, read);

module.exports = router;