const express = require("express");
const { create } = require("../controllers/blogController");
const router = express.Router();
const { requireSignin, adminMiddleware } = require("../controllers/authController");


router.post("/blog-create", requireSignin, adminMiddleware, create);

module.exports = router;