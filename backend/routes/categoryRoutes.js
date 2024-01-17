const express = require("express");
const router = express.Router();
const { create, list, showCategory, deleteCategory } = require("../controllers/categoryController.js");

// validators
const { runValidation } = require("../validators/index");
const { categoryCreateValidator } = require("../validators/category");
const { requireSignin, adminMiddleware } = require("../controllers/authController");

router.post('/category-create', categoryCreateValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/categories', categoryCreateValidator, requireSignin, adminMiddleware, list);
router.delete('/category-delete/:slug', categoryCreateValidator, requireSignin, adminMiddleware, deleteCategory);
router.get('/category/:slug', categoryCreateValidator, requireSignin, adminMiddleware, showCategory);



module.exports = router;