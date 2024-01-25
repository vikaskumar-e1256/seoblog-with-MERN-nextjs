const express = require("express");
const router = express.Router();
const { create, list, showTag, deleteTag } = require("../controllers/tagController.js");

// validators
const { runValidation } = require("../validators/index");
const { tagCreateValidator } = require("../validators/tag.js");
const { requireSignin, adminMiddleware } = require("../controllers/authController.js");

router.post('/tag-create', tagCreateValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/tags', list);
router.delete('/tag-delete/:slug', requireSignin, adminMiddleware, deleteTag);
router.get('/tag/:slug', showTag);



module.exports = router;