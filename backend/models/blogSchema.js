const mongoose = require("mongoose");
const Category = require('./categorySchema');
const Tag = require('./tagSchema');
const User = require('./userSchema');
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
        min:3,
        max: 160,
    },
    slug: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        index: true
    },
    body: {
        type: {},
        trim: true,
        required: true,
        min: 200,
        max: 2000000,
    },
    excerpt: { // this is used for first max 1000 character of a blog
        type: String,
        required: true,
        max: 1000
    },
    mtitle: {
        type: String,
    },
    mdesc: {
        type: String,
    },
    photo: {
        data: Buffer,
        contetType: String
    },
    // This has taken in array because blog has multiple category or tags
    categories: [{
        type: ObjectId, // used for relation
        ref: Category, // Model name
        requried: true
    }],
    tags: [{
        type: ObjectId, // used for relation
        ref: Tag, // Model name
        requried: true
    }],
    postedBy: {
        type: ObjectId, // used for relation
        ref: User, // Model name
        requried: true
    }
}, { timestamp: true });


module.exports = mongoose.model('blogs', blogSchema);