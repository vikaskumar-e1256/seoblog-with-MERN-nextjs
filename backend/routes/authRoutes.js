const express = require("express");
const router = express.Router();
const { signup, signin, signout } = require("../controllers/authController");

// validators
const { runValidation } = require("../validators/index");
const { userSignupValidator, userSigninValidator } = require("../validators/auth");

router.post("/signup", userSignupValidator, runValidation,  signup);
router.post("/signin", userSigninValidator, runValidation,  signin);
router.get("/signout", signout);


module.exports = router;