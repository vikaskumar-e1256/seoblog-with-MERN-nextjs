const Tag = require('../models/tagSchema');
const slugify = require('slugify');
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) => {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();

    // Check Tag already in database
    Tag.findOne({ name: name }).then((tag) => {
        // if (tag) {
        //     return res.status(400).json({
        //         error: 'Tag name is already taken'
        //     });
        // }

        let newTag = new Tag({ name, slug });

        newTag.save().then((success) => {
            // Handle success
            res.json({
                message: 'Tag successfully created.',
                tag: success,
            });
        }).catch((err) => {
            // Handle save error
            return res.status(422).json({
                error: errorHandler(err) || 'Error during Tag creating'
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
    Tag.find({})
        .then((tags) => {
            res.json({
                message: 'Tags successfully retrieved.',
                tags: tags,
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                error: 'Internal Server Error',
            });
        });
};

exports.deleteTag = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.findOneAndDelete({ slug })
        .then((tag) => {
            if (tag) {
                res.json({
                    message: 'Tag successfully deleted.',
                    tag,
                });
            } else {
                res.json({
                    message: 'No Tag found.',
                    tag: null,
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

exports.showTag = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    Tag.findOne({slug:slug})
        .then((tag) => {
            if (tag) {
                res.json({
                    message: 'Tag successfully retrieved.',
                    tag: tag,
                });
            } else {
                res.json({
                    message: 'No Tag found.',
                    tag: null,
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
