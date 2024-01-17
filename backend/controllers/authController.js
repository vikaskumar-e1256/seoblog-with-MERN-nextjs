const User = require('../models/userSchema');
const shortId = require('shortid');
const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require("express-jwt");

exports.signup = (req, res) => {
    const { name, email, password } = req.body;

    // Check user already in database
    User.findOne({ email: email }).then((user) => {
        if (user) {
            return res.status(400).json({
                error: 'Email is already taken'
            });
        }

        let username = shortId.generate();
        let profile = `${process.env.CLIENT_URL}/profile/${username}`;
        let newUser = new User({ name, email, password, profile, username });

        newUser.save().then((success) => {
            // Handle success
            res.json({
                message: 'Signup success! Please signin.'
            });
        }).catch((err) => {
            // Handle save error
            return res.status(400).json({
                error: err.message || 'Error during user registration'
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

exports.signin = (req, res) => {
    const { email, password } = req.body;

    // Check if the user exists in the database
    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(401).json({
                error: 'User not found. Please sign up.'
            });
        }

        // Authenticate user
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Incorrect password. Please try again.'
            });
        }

        // Generate JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Set the token in the cookie
        res.cookie('token', token, { expiresIn: '1d' });

        // Return response to the client
        const { _id, name, email, username, role } = user;
        return res.json({
            token,
            user: { _id, name, email, username, role }
        });
    }).catch((err) => {
        console.error(err);
        return res.status(500).json({
            error: 'Internal Server Error'
        });
    });

};

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "Signout success"
    });
}

// check token is expired or not
exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth",
});

exports.authMiddleware = (req, res, next) => {
    const authUserId = req.auth._id;

    User.findById(authUserId)
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            // Optionally, you can attach the user object to the request for later use
            req.profile = user;

            // Continue to the next middleware or route handler
            next();
        })
        .catch(err => {
            console.error('Error in authMiddleware:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

exports.adminMiddleware = (req, res, next) => {
    const adminUserId = req.auth._id;

    User.findById(adminUserId)
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            if (user.role !== 1) {
                return res.status(400).json({ error: 'Admin resource. Access denied' });
            }

            // Optionally, you can attach the user object to the request for later use
            req.profile = user;

            // Continue to the next middleware or route handler
            next();
        })
        .catch(err => {
            console.error('Error in authMiddleware:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};