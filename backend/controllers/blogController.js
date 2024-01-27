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

exports.list = (req, res) => {
    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .then((data) => {
            res.json(data);
        }).catch((err) => {
            return res.json({
                error: errorHandler(err)
            });
        });
};

exports.listAllBlogsCategoriesTags = (req, res) => {
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let blogs;
    let categories;
    let tags;

    Blog.find({})
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username profile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title slug excerpt categories tags postedBy createdAt updatedAt')
        .then((data) => {

            blogs = data; // blogs
            // get all categories
            Category.find({}).then((c) => {
                categories = c; // categories
                // get all tags
                Tag.find({}).then((t) => {
                    tags = t;
                    // return all blogs categories tags
                    res.json({ blogs, categories, tags, size: blogs.length });
                }).catch(err => {
                    return res.json({
                        error: errorHandler(err)
                    });
                });
            }).catch(err => {
                return res.json({
                    error: errorHandler(err)
                });
            });
        }).catch(err => {
            return res.json({
                error: errorHandler(err)
            });
        });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({ slug })
        // .select("-photo")
        .populate('categories', '_id name slug')
        .populate('tags', '_id name slug')
        .populate('postedBy', '_id name username')
        .select('_id title body slug mtitle mdesc categories tags postedBy createdAt updatedAt')
        .then((data) => {
            res.json(data);
        }).catch(err => {
            console.log(err);
            return res.json({
                error: errorHandler(err)
            });
        });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOneAndDelete({ slug }).then((data) => {
        res.json({
            message: 'Blog deleted successfully'
        });
    }).catch(err => {
        return res.json({
            error: errorHandler(err)
        });
    });
};

exports.update = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({ slug }).exec((err, oldBlog) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        let form = new formidable.IncomingForm({
            uploadDir: path.join(__dirname, '..', 'uploads'),
            keepExtensions: true
        });

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.status(400).json({
                    error: 'Image could not upload'
                });
            }
            let slugBeforeMerge = oldBlog.slug;
            oldBlog = _.merge(oldBlog, fields);
            oldBlog.slug = slugBeforeMerge;

            const { body, categories, tags } = fields;

            if (body) {
                oldBlog.excerpt = smartTrim(body[0], 320, ' ', ' ...');
                oldBlog.mdesc = stripHtml(body[0].substring(0, 160));
            }

            if (categories) {
                oldBlog.categories = categories[0].split(',');
            }

            if (tags) {
                oldBlog.tags = tags[0].split(',');
            }

            if (files.photo) {
                if (files.photo.size > 10000000) {
                    return res.status(400).json({
                        error: 'Image should be less then 1mb in size'
                    });
                }
                oldBlog.photo.data = fs.readFileSync(files.photo[0].filepath);
                oldBlog.photo.contentType = files.photo.type;
            }

            oldBlog.save((err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                // result.photo = undefined;
                res.json(result);
            });
        });
    });
};

// exports.update = (req, res) => {
//     //console.log(req);
//     const slug = req.params.slug.toLowerCase();

//     Blog.findOne({ slug }).then((oldBlog) => {

//         upload(req, res, (err) => {

//             if (err) {
//                 return res.status(400).json({
//                     error: 'Image could not be uploaded'
//                 });
//             }

//             let slugBeforeMerge = oldBlog.slug;
//             oldBlog = _.merge(oldBlog, fields);
//             oldBlog.slug = slugBeforeMerge;

//             const { body, desc, categories, tags } = fields;

//             if (!body || body.length < 200) {
//                 return res.status(400).json({
//                     error: 'Content is too short'
//                 });
//             }

//             if (!categories || categories.length === 0) {
//                 return res.status(400).json({
//                     error: 'At least one category is required'
//                 });
//             }

//             if (!tags || tags.length === 0) {
//                 return res.status(400).json({
//                     error: 'At least one tag is required'
//                 });
//             }


//             // Update fields based on form data
//             if (title) {
//                 oldBlog.title = title;
//                 oldBlog.slug = slugify(title).toLowerCase();
//                 oldBlog.mtitle = `${title} | ${process.env.APP_NAME}`;
//             }

//             if (body) {
//                 oldBlog.body = body;
//                 oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...');
//                 oldBlog.mdesc = stripHtml(body.substring(0, 160));
//             }

//             if (categories) {
//                 oldBlog.categories = categories.split(',');
//             }

//             if (tags) {
//                 oldBlog.tags = tags.split(',');
//             }


//             if (req.files && req.files.length > 0) {
//                 const photoFile = req.files[0];

//                 oldBlog.photo.data = fs.readFileSync(photoFile.path);
//                 oldBlog.photo.contentType = photoFile.mimetype;
//             } else {
//                 return res.status(400).json({
//                     error: 'Photo field is required'
//                 });
//             }

//             oldBlog.save().then(result => {
//                 res.json(updatedBlog);
//             })
//             .catch(err => {
//                 console.log(err);
//                 return res.status(400).json({
//                     error: errorHandler(err)
//                 });
//             });
//         });
//     }).catch(err => {
//         console.log(err, 'there');
//         return res.status(400).json({
//             error: errorHandler(err)
//         });
//     });
// };

exports.photo = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Blog.findOne({ slug })
        .select('photo')
        .then(blog => {
            res.set('Content-Type', blog.photo.contentType);
            return res.send(blog.photo.data);
        }).catch(err => {
            return res.status(400).json({
                error: errorHandler(err)
            });
        });
};

exports.listRelated = (req, res) => {
    // console.log(req.body.blog);
    let limit = req.body.limit ? parseInt(req.body.limit) : 3;
    const { _id, categories } = req.body.blog;

    Blog.find({ _id: { $ne: _id }, categories: { $in: categories } })
        .limit(limit)
        .populate('postedBy', '_id name profile')
        .select('title slug excerpt postedBy createdAt updatedAt')
        .then((blogs) => {
            res.json(blogs);
        }).catch(err => {
            return res.status(400).json({
                error: 'Blogs not found'
            });
        });
};