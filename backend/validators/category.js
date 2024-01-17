const { check } = require("express-validator");

exports.categoryCreateValidator = [
    check('name')
        .not()
        .isEmpty()
        .withMessage("Name field is required")
];