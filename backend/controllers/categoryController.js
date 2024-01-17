const Category = require('../models/categorySchema');
const slugify = require('slugify');
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();

    // Check category already in database
    Category.findOne({ name: name }).then((category) => {
        // if (category) {
        //     return res.status(400).json({
        //         error: 'Category name is already taken'
        //     });
        // }

        let newCategory = new Category({ name, slug });

        newCategory.save().then((success) => {
            // Handle success
            res.json({
                message: 'Category successfully created.',
                category: success,
            });
        }).catch((err) => {
            // Handle save error
            return res.status(422).json({
                error: errorHandler(err) || 'Error during category creating'
            });
        });
    }).catch((err) => {
        // Handle findOne error
        console.error(err);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    });

};

exports.list = (req, res) => {
    Category.find({})
        .then((categories) => {
            res.json({
                message: 'Categories successfully retrieved.',
                categories: categories,
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                error: 'Internal Server Error',
            });
        });
};

exports.deleteCategory = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOneAndDelete({ slug })
        .then((category) => {
            if (category) {
                res.json({
                    message: 'Category successfully deleted.',
                    category,
                });
            } else {
                res.json({
                    message: 'No category found.',
                    category: null,
                });
            }
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                error: 'Internal Server Error',
            });
        });
 }

exports.showCategory = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Category.findOne({slug:slug})
        .then((category) => {
            if (category) {
                res.json({
                    message: 'Category successfully retrieved.',
                    category: category,
                });
            } else {
                res.json({
                    message: 'No category found.',
                    category: null,
                });
            }

        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                error: 'Internal Server Error',
            });
        });
}
