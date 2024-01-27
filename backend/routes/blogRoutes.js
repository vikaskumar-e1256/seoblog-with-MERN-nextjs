const express = require("express");
const { create, list, read, listAllBlogsCategoriesTags, remove, update, photo } = require("../controllers/blogController");
const router = express.Router();
const { requireSignin, adminMiddleware } = require("../controllers/authController");


router.post("/blog-create", requireSignin, adminMiddleware, create);
router.get("/blogs", list);
router.post("/blogs-categories-tags", listAllBlogsCategoriesTags);
router.get("/blog/:slug", read);
router.delete("/blog/:slug", requireSignin, adminMiddleware, remove);
router.put("/blog/:slug", requireSignin, adminMiddleware, update);
router.get("/blog/photo/:slug", photo);

module.exports = router;