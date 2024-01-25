const Category = require('../models/categorySchema');
const Blog = require('../models/blogSchema');
const Tag = require('../models/tagSchema');
const formidable = require('formidable'); // handle the form data with file upload
const slugify = require('slugify');
const stripHtml = require("string-strip-html");
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandler');
const fs = require('fs');
const { smartTrim } = require('../helpers/blog');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');

// Multer configuration for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 } // 10MB limit
}).array('photo');


exports.create = (req, res) => {
    upload(req, res, (err) => {
        console.log(err);
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }

        const { title, body, categories, tags } = req.body;

        if (!title || !title.length) {
            return res.status(400).json({
                error: 'title is required'
            });
        }

        if (!body || body.length < 200) {
            return res.status(400).json({
                error: 'Content is too short'
            });
        }

        if (!categories || categories.length === 0) {
            return res.status(400).json({
                error: 'At least one category is required'
            });
        }

        if (!tags || tags.length === 0) {
            return res.status(400).json({
                error: 'At least one tag is required'
            });
        }


        let blog = new Blog();
        blog.title = title;
        blog.body = body;
        blog.excerpt = smartTrim(body, 320, ' ', ' ...');
        blog.slug = slugify(title).toLowerCase();
        blog.mtitle = `${title} | ${process.env.APP_NAME}`;
        blog.mdesc = stripHtml(body.substring(0, 160));
        blog.postedBy = req.auth._id;
        // categories and tags
        let arrayOfCategories = categories && categories.split(',');
        let arrayOfTags = tags && tags.split(',');


        if (req.files && req.files.length > 0) {
            const photoFile = req.files[0];

            blog.photo.data = fs.readFileSync(photoFile.path);
            blog.photo.contentType = photoFile.mimetype;
        } else {
            return res.status(400).json({
                error: 'Photo field is required'
            });
        }

        blog.save().then(result => {
            console.log(arrayOfCategories, arrayOfTags);

            // Update categories using $push
            Blog.findByIdAndUpdate(result._id, { $push: { categories: { $each: arrayOfCategories } } }, { new: true })
                .then(updatedBlog => {
                    // Update tags using $push
                    return Blog.findByIdAndUpdate(updatedBlog._id, { $push: { tags: { $each: arrayOfTags } } }, { new: true });
                })
                .then(finalUpdatedBlog => {
                    res.json(finalUpdatedBlog);
                })
                .catch(err => {
                    console.log(err);
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                });
        })
            .catch(err => {
                console.log(err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            });

    });
};